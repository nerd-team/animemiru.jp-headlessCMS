import { getServerSideURL } from '@/utilities/getURL'

export default function robots() {
  const siteUrl = getServerSideURL()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/next/'],
      },
    ],
    sitemap: [`${siteUrl}/pages-sitemap.xml`, `${siteUrl}/posts-sitemap.xml`],
  }
}
