import config from '@payload-config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

import { sanitizeHtml } from '@/lib/sanitizeHtml'
import { enrichContentHtml } from '@/lib/enrichContentHtml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')

export type WpMigrateOptions = {
  wpUrl?: string
  limit?: number
  startPage?: number
  perPage?: number
  downloadImages?: boolean
  dryRun?: boolean
}

type WPPost = {
  id: number
  slug: string
  date: string
  modified: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  categories: number[]
  _embedded?: {
    'wp:featuredmedia'?: Array<{ id: number; source_url: string }>
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string; taxonomy: string }>>
  }
}

type WPCategory = {
  id: number
  name: string
  slug: string
}

export type WpMigrateResult = {
  message: string
  created: number
  skipped: number
  failed: number
  categories: number
  hasMore: boolean
  nextPage: number
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function textToLexical(text: string) {
  const value = text.slice(0, 500) || 'Imported from WordPress'
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: value, version: 1 }],
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

function postSlug(wpId: number) {
  return `post-${wpId}`
}

function categorySlug(wpId: number) {
  return `cat-${wpId}`
}

async function wpFetch<T>(wpUrl: string, path: string): Promise<{ data: T; totalPages: number }> {
  const res = await fetch(`${wpUrl}/wp-json/wp/v2${path}`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) {
    throw new Error(`WP API error ${res.status}: ${path}`)
  }

  const totalPages = Number(res.headers.get('x-wp-totalpages') || 1)
  const data = (await res.json()) as T
  return { data, totalPages }
}

async function downloadImage(url: string, dest: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) })
  if (!res.ok) throw new Error(`Download failed: ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, buf)
}

function firstImageFromHtml(html: string) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1]
}

async function ensureCategory(
  payload: Awaited<ReturnType<typeof getPayload>>,
  wpCat: WPCategory,
  cache: Map<number, string>,
) {
  if (cache.has(wpCat.id)) return cache.get(wpCat.id)!

  const slug = wpCat.slug || categorySlug(wpCat.id)
  const found = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (found.docs[0]) {
    cache.set(wpCat.id, found.docs[0].id)
    return found.docs[0].id
  }

  const created = await payload.create({
    collection: 'categories',
    data: { title: wpCat.name, slug },
    overrideAccess: true,
  })
  cache.set(wpCat.id, created.id)
  return created.id
}

async function ensureMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  url: string,
  alt: string,
  cache: Map<string, string>,
  downloadImages: boolean,
) {
  if (!downloadImages || !url) return undefined
  if (cache.has(url)) return cache.get(url)

  try {
    const parsed = new URL(url)
    const base = path.basename(parsed.pathname)
    const localPath = path.join(ROOT, 'public', 'media', 'wp', base)
    await downloadImage(url, localPath)

    const created = await payload.create({
      collection: 'media',
      filePath: localPath,
      data: { alt },
      overrideAccess: true,
    })
    cache.set(url, created.id)
    return created.id
  } catch {
    return undefined
  }
}

export async function migrateFromWordPress(options: WpMigrateOptions = {}): Promise<WpMigrateResult> {
  const wpUrl = options.wpUrl || process.env.WP_URL || 'https://animemiru.jp'
  const limit = options.limit ?? Number(process.env.WP_MIGRATE_LIMIT || 50)
  const startPage = options.startPage ?? Number(process.env.WP_MIGRATE_PAGE || 1)
  const perPage = Math.min(options.perPage ?? 20, 100)
  const downloadImages = options.downloadImages ?? process.env.WP_MIGRATE_IMAGES !== 'false'
  const dryRun = options.dryRun ?? false

  const payload = await getPayload({ config })
  const categoryMap = new Map<number, string>()
  const mediaCache = new Map<string, string>()

  let categoriesCreated = 0
  let catPage = 1
  while (true) {
    const { data: categories } = await wpFetch<WPCategory[]>(
      wpUrl,
      `/categories?per_page=100&page=${catPage}`,
    )
    if (categories.length === 0) break

    for (const wpCat of categories) {
      const before = categoryMap.size
      await ensureCategory(payload, wpCat, categoryMap)
      if (categoryMap.size > before) categoriesCreated++
    }

    catPage++
  }
  let created = 0
  let skipped = 0
  let failed = 0
  let page = startPage
  let hasMore = true
  let wpTotalPages = 1

  while (created + skipped + failed < limit && hasMore) {
    const { data: posts, totalPages } = await wpFetch<WPPost[]>(
      wpUrl,
      `/posts?per_page=${perPage}&page=${page}&status=publish&_embed=wp:featuredmedia,wp:term`,
    )
    wpTotalPages = totalPages

    if (posts.length === 0) {
      hasMore = false
      break
    }

    for (const wpPost of posts) {
      if (created + skipped + failed >= limit) break

      const existing = await payload.find({
        collection: 'posts',
        where: { wpId: { equals: wpPost.id } },
        limit: 1,
      })

      if (existing.docs[0]) {
        skipped++
        continue
      }

      try {
        const terms = wpPost._embedded?.['wp:term']?.flat() || []
        const categoryIds: string[] = []

        for (const term of terms) {
          if (term.taxonomy !== 'category') continue
          const id = await ensureCategory(payload, term, categoryMap)
          if (!categoryIds.includes(id)) categoryIds.push(id)
        }

        for (const wpCatId of wpPost.categories) {
          if (!categoryMap.has(wpCatId)) continue
          const id = categoryMap.get(wpCatId)!
          if (!categoryIds.includes(id)) categoryIds.push(id)
        }

        const title = stripHtml(wpPost.title.rendered)
        const contentHtml = enrichContentHtml(
          sanitizeHtml(wpPost.content.rendered),
          title,
        )
        const featured =
          wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
          firstImageFromHtml(contentHtml)

        let heroImageId: string | undefined
        if (!dryRun) {
          heroImageId = await ensureMedia(
            payload,
            featured || '',
            title,
            mediaCache,
            downloadImages,
          )
        }

        if (!dryRun) {
          await payload.create({
            collection: 'posts',
            draft: false,
            overrideAccess: true,
            data: {
              title,
              slug: postSlug(wpPost.id),
              wpId: wpPost.id,
              excerpt: stripHtml(wpPost.excerpt.rendered),
              contentHtml,
              publishedAt: wpPost.date,
              modifiedAt: wpPost.modified,
              categories: categoryIds,
              heroImage: heroImageId,
              content: textToLexical(stripHtml(contentHtml)),
              _status: 'published',
            },
          })
        }

        created++
      } catch (error) {
        failed++
        console.error(`Failed to migrate post ${wpPost.id}:`, error)
      }
    }

    page++
    hasMore = page <= wpTotalPages && created + skipped + failed < limit
  }

  return {
    message: dryRun ? 'Dry run complete' : 'WordPress migration batch complete',
    created,
    skipped,
    failed,
    categories: categoriesCreated,
    hasMore: page <= wpTotalPages,
    nextPage: page,
  }
}
