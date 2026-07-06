import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getSiteUrl } from '@/lib/getSiteUrl'
import { getPostPath } from '@/utilities/getPostCanonicalUrl'

const getPostsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const siteUrl = getSiteUrl()
    const dateFallback = new Date().toISOString()
    const entries: Array<{ loc: string; lastmod: string }> = []

    let page = 1
    let hasMore = true

    while (hasMore) {
      const results = await payload.find({
        collection: 'posts',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 500,
        page,
        where: { _status: { equals: 'published' } },
        select: {
          slug: true,
          wpId: true,
          updatedAt: true,
          publishedAt: true,
        },
      })

      for (const post of results.docs) {
        if (!post.slug && !post.wpId) continue
        entries.push({
          loc: `${siteUrl}${getPostPath(post)}`,
          lastmod: post.updatedAt || post.publishedAt || dateFallback,
        })
      }

      hasMore = results.hasNextPage
      page++
    }

    return entries
  },
  ['posts-sitemap'],
  { tags: ['posts-sitemap'] },
)

export async function GET() {
  const sitemap = await getPostsSitemap()
  return getServerSideSitemap(sitemap)
}
