import type { Media, Post } from '@/payload-types'

import { bestImageFromContent, normalizeMediaUrl } from '@/utilities/normalizeMediaUrl'

export function getPostImageUrl(post: Pick<Post, 'heroImage' | 'contentHtml'>): string {
  const fromContent = bestImageFromContent(post.contentHtml)

  const hero = post.heroImage
  if (typeof hero === 'object' && hero !== null) {
    const media = hero as Media
    const heroUrl = normalizeMediaUrl(media.url || media.sizes?.thumbnail?.url)
    if (heroUrl && !heroUrl.includes('/api/media/')) {
      return heroUrl
    }
  }

  if (fromContent) return fromContent

  if (typeof hero === 'object' && hero !== null) {
    const media = hero as Media
    const heroUrl = normalizeMediaUrl(media.url || media.sizes?.thumbnail?.url)
    if (heroUrl) return heroUrl
  }

  return '/theme/images/no-img.png'
}
