import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MongoMemoryServer } from 'mongodb-memory-server'
import net from 'node:net'
import { getPayload } from 'payload'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

async function isPortOpen(port: number) {
  return new Promise<boolean>((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port })
    socket.once('connect', () => {
      socket.end()
      resolve(true)
    })
    socket.once('error', () => resolve(false))
  })
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').trim()
}

function htmlToLexical(html: string) {
  const text = stripHtml(html).slice(0, 2000) || 'デモ記事本文'
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text, version: 1 }],
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

async function downloadFile(url: string, dest: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed: ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, buf)
  return dest
}

async function main() {
  let memoryServer: MongoMemoryServer | undefined

  if (!(await isPortOpen(27017))) {
    memoryServer = await MongoMemoryServer.create()
    process.env.DATABASE_URL = memoryServer.getUri('animemiru')
    console.log('[seed] Using in-memory MongoDB')
  }

  const { default: config } = await import(path.join(ROOT, 'src/payload.config.ts'))
  const payload = await getPayload({ config })

  const users = await payload.find({ collection: 'users', limit: 1 })
  if (users.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@animemiru.local',
        password: 'animemiru123',
        name: 'Admin',
      },
    })
    console.log('[seed] Created admin user: admin@animemiru.local / animemiru123')
  }

  const wpRes = await fetch(
    'https://animemiru.jp/wp-json/wp/v2/posts?per_page=3&_embed=wp:featuredmedia,wp:term',
  )
  const wpPosts = (await wpRes.json()) as Array<{
    id: number
    slug: string
    date: string
    title: { rendered: string }
    excerpt: { rendered: string }
    content: { rendered: string }
    categories: number[]
    _embedded?: {
      'wp:featuredmedia'?: Array<{ source_url: string; alt_text?: string }>
      'wp:term'?: Array<Array<{ id: number; name: string; slug: string; taxonomy: string }>>
    }
  }>

  const categoryMap = new Map<number, string>()

  for (const wpPost of wpPosts) {
    const terms = wpPost._embedded?.['wp:term']?.flat() || []
    for (const term of terms) {
      if (term.taxonomy !== 'category') continue
      if (categoryMap.has(term.id)) continue

      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: term.slug } },
        limit: 1,
      })

      if (existing.docs[0]) {
        categoryMap.set(term.id, existing.docs[0].id)
        continue
      }

      const created = await payload.create({
        collection: 'categories',
        data: { title: term.name, slug: term.slug },
      })
      categoryMap.set(term.id, created.id)
      console.log(`[seed] Category: ${term.name}`)
    }
  }

  for (const wpPost of wpPosts) {
    const existing = await payload.find({
      collection: 'posts',
      where: { wpId: { equals: wpPost.id } },
      limit: 1,
    })
    if (existing.docs[0]) {
      console.log(`[seed] Skip existing post ${wpPost.id}`)
      continue
    }

    let heroImageId: string | undefined
    const media = wpPost._embedded?.['wp:featuredmedia']?.[0]
    if (media?.source_url) {
      const ext = path.extname(new URL(media.source_url).pathname) || '.jpg'
      const localPath = path.join(ROOT, 'public', 'media', 'seed', `${wpPost.id}${ext}`)
      await downloadFile(media.source_url, localPath)

      const createdMedia = await payload.create({
        collection: 'media',
        filePath: localPath,
        data: { alt: stripHtml(wpPost.title.rendered) },
      })
      heroImageId = createdMedia.id
    }

    const categoryIds = wpPost.categories
      .map((id) => categoryMap.get(id))
      .filter((id): id is string => Boolean(id))

    const title = stripHtml(wpPost.title.rendered)
    const slug = decodeURIComponent(wpPost.slug)

    await payload.create({
      collection: 'posts',
      draft: false,
      data: {
        title,
        slug,
        wpId: wpPost.id,
        excerpt: stripHtml(wpPost.excerpt.rendered),
        publishedAt: wpPost.date,
        categories: categoryIds,
        heroImage: heroImageId,
        content: htmlToLexical(wpPost.content.rendered),
        _status: 'published',
      },
    })

    console.log(`[seed] Post: ${title}`)
  }

  if (memoryServer) await memoryServer.stop()
  console.log('[seed] Done - 3 demo posts ready')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
