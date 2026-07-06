import type { Post } from '@/payload-types'

export function getPostHref(post: Pick<Post, 'slug' | 'wpId'>) {
  return post.wpId ? `/articles/${post.wpId}` : `/articles/${post.slug}`
}

export function getPostSharePath(post: Pick<Post, 'slug' | 'wpId'>) {
  return getPostHref(post)
}
