import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

export async function GET() {
  const siteUrl = getServerSideURL()

  const body = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /next/

Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/pages-sitemap.xml
Sitemap: ${siteUrl}/posts-sitemap.xml

# LLMs
# ${siteUrl}/llms.txt
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
