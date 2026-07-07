import type { Media, Post } from '@/payload-types'

function firstImageFromContent(html?: string | null) {
  if (!html) return null
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1] ?? null
}

function isBrokenMediaUrl(url: string): boolean {
  return url.startsWith('/api/media/') || url.includes('/api/media/file/')
}

export function getPostImageUrl(post: Pick<Post, 'heroImage' | 'contentHtml'>): string {
  const fromContent = firstImageFromContent(post.contentHtml)
  if (fromContent) return fromContent

  const hero = post.heroImage

  if (typeof hero === 'object' && hero !== null) {
    const media = hero as Media
    const url = media.url || media.sizes?.thumbnail?.url
    if (url && !isBrokenMediaUrl(url)) return url
  }

  return '/theme/images/no-img.png'
}
