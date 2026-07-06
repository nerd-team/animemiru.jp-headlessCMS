import config from '@payload-config'
import { getPayload } from 'payload'

import { getPostPath } from '@/utilities/getPostCanonicalUrl'
import { getSiteUrl } from '@/lib/getSiteUrl'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET() {
  const payload = await getPayload({ config })
  const siteUrl = getSiteUrl()

  const posts = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 50,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
    select: {
      title: true,
      slug: true,
      wpId: true,
      excerpt: true,
      publishedAt: true,
      modifiedAt: true,
      updatedAt: true,
    },
  })

  const items = posts.docs
    .map((post) => {
      const link = `${siteUrl}${getPostPath(post)}`
      const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : ''
      const description = post.excerpt ? escapeXml(post.excerpt.slice(0, 200)) : ''

      return `<item>
  <title>${escapeXml(post.title || '')}</title>
  <link>${link}</link>
  <guid isPermaLink="true">${link}</guid>
  <pubDate>${pubDate}</pubDate>
  <description>${description}</description>
</item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>アニメミル</title>
    <link>${siteUrl}</link>
    <description>アニメ好きのためのエンタメマガジン</description>
    <language>ja</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
