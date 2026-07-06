import { sanitizeHtml } from '@/lib/sanitizeHtml'

const WP_URL = process.env.WP_URL || 'https://animemiru.jp'

export async function fetchWpPageHtml(slug: string) {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}`, {
    next: { revalidate: 86400 },
  })

  if (!res.ok) return null

  const pages = (await res.json()) as Array<{
    title: { rendered: string }
    content: { rendered: string }
    modified: string
  }>

  const page = pages[0]
  if (!page) return null

  return {
    title: page.title.rendered.replace(/<[^>]+>/g, ''),
    html: sanitizeHtml(page.content.rendered),
    updatedAt: page.modified,
  }
}
