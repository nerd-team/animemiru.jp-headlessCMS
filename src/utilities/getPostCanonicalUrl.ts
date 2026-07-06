import type { Post } from '@/payload-types'

import { getServerSideURL } from '@/utilities/getURL'

export function getPostPath(post: Pick<Post, 'slug' | 'wpId'>) {
  return post.wpId ? `/articles/${post.wpId}` : `/articles/${post.slug}`
}

export function getPostCanonicalUrl(post: Pick<Post, 'slug' | 'wpId'>) {
  return `${getServerSideURL()}${getPostPath(post)}`
}
