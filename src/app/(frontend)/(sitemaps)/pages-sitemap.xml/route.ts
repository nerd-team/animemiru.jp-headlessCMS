import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getSiteUrl } from '@/lib/getSiteUrl'
import { getCategoryHref } from '@/utilities/categorySlug'

export const dynamic = 'force-dynamic'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const siteUrl = getSiteUrl()
    const dateFallback = new Date().toISOString()

    const staticPages = [
      { loc: `${siteUrl}/`, lastmod: dateFallback },
      { loc: `${siteUrl}/search`, lastmod: dateFallback },
      { loc: `${siteUrl}/sitemap`, lastmod: dateFallback },
      { loc: `${siteUrl}/terms`, lastmod: dateFallback },
      { loc: `${siteUrl}/contact`, lastmod: dateFallback },
      { loc: `${siteUrl}/anime-glossary`, lastmod: dateFallback },
      { loc: `${siteUrl}/articles/category`, lastmod: dateFallback },
      { loc: `${siteUrl}/articles/author/editor`, lastmod: dateFallback },
    ]

    const categories = await payload.find({
      collection: 'categories',
      limit: 1000,
      pagination: false,
      select: { slug: true, updatedAt: true },
    })

    const categoryPages = categories.docs.map((category) => ({
      loc: `${siteUrl}${getCategoryHref(category.slug)}`,
      lastmod: category.updatedAt || dateFallback,
    }))

    const pages = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: { _status: { equals: 'published' } },
      select: { slug: true, updatedAt: true },
    })

    const cmsPages = pages.docs
      .filter((page) => page.slug && page.slug !== 'home')
      .map((page) => ({
        loc: `${siteUrl}/${page.slug}`,
        lastmod: page.updatedAt || dateFallback,
      }))

    return [...staticPages, ...categoryPages, ...cmsPages]
  },
  ['pages-sitemap'],
  { tags: ['pages-sitemap'] },
)

export async function GET() {
  const sitemap = await getPagesSitemap()
  return getServerSideSitemap(sitemap)
}
