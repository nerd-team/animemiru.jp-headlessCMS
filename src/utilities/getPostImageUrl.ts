import type { Media, Post } from '@/payload-types'

export function getPostImageUrl(post: Post): string {
  const hero = post.heroImage

  if (typeof hero === 'object' && hero !== null) {
    const media = hero as Media
    if (media.url) return media.url
    if (media.sizes?.thumbnail?.url) return media.sizes.thumbnail.url
  }

  return '/theme/images/no-img.png'
}
