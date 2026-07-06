import type { Media, Post } from '@/payload-types'

function firstImageFromContent(html?: string | null) {
  if (!html) return null
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1] ?? null
}

export function getPostImageUrl(post: Pick<Post, 'heroImage' | 'contentHtml'>): string {
  const hero = post.heroImage

  if (typeof hero === 'object' && hero !== null) {
    const media = hero as Media
    if (media.url) return media.url
    if (media.sizes?.thumbnail?.url) return media.sizes.thumbnail.url
  }

  const fromContent = firstImageFromContent(post.contentHtml)
  if (fromContent) return fromContent

  return '/theme/images/no-img.png'
}
