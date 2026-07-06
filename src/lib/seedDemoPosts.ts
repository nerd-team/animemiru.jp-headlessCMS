import config from '@payload-config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

import { DEMO_POSTS } from '@/lib/demoPostsData'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')

const IMAGE_URLS: Record<number, string> = {
  149400:
    'https://animemiru.jp/wp-content/uploads/2026/03/nanoniwoisaretanodenohemashita-shi-zun2-eye-catch-featured-01.jpg',
  149393: 'https://animemiru.jp/wp-content/uploads/2026/03/noi-eye-catch-featured-01.jpg',
}

function textToLexical(text: string) {
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

async function downloadImage(url: string, dest: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`Download failed: ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, buf)
}

async function createHeroImage(payload: Awaited<ReturnType<typeof getPayload>>, wpId: number, alt: string) {
  const url = IMAGE_URLS[wpId]
  if (!url) return undefined

  try {
    const ext = path.extname(new URL(url).pathname) || '.jpg'
    const localPath = path.join(ROOT, 'public', 'media', 'seed', `${wpId}${ext}`)
    await downloadImage(url, localPath)

    const createdMedia = await payload.create({
      collection: 'media',
      filePath: localPath,
      data: { alt },
      overrideAccess: true,
    })

    return createdMedia.id
  } catch {
    return undefined
  }
}

export async function seedDemoPosts() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'posts',
    limit: 1,
    where: { _status: { equals: 'published' } },
  })

  if (existing.totalDocs > 0) {
    return { message: 'Posts already exist', count: existing.totalDocs }
  }

  const users = await payload.find({ collection: 'users', limit: 1 })
  if (users.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@animemiru.local',
        password: 'animemiru123',
        name: 'Admin',
      },
      overrideAccess: true,
    })
  }

  const categoryMap = new Map<string, string>()

  for (const post of DEMO_POSTS) {
    const { slug, title } = post.category
    if (categoryMap.has(slug)) continue

    const found = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (found.docs[0]) {
      categoryMap.set(slug, found.docs[0].id)
      continue
    }

    const created = await payload.create({
      collection: 'categories',
      data: { title, slug },
      overrideAccess: true,
    })
    categoryMap.set(slug, created.id)
  }

  let created = 0

  for (const [index, post] of DEMO_POSTS.entries()) {
    const categoryId = categoryMap.get(post.category.slug)
    const heroImage = await createHeroImage(payload, post.wpId, post.title)

    await payload.create({
      collection: 'posts',
      draft: false,
      overrideAccess: true,
      data: {
        title: post.title,
        slug: post.slug,
        wpId: post.wpId,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        categories: categoryId ? [categoryId] : [],
        heroImage,
        viewCount: DEMO_POSTS.length - index,
        content: textToLexical(post.body),
        _status: 'published',
      },
    })
    created++
  }

  return { message: 'Seeded demo posts', count: created }
}
