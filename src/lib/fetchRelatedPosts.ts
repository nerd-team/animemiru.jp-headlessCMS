import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Post } from '@/payload-types'

function getCategoryIds(post: Post): string[] {
  return (post.categories || [])
    .map((category) => (typeof category === 'object' && category !== null ? category.id : category))
    .filter((id): id is string => Boolean(id))
}

/** 同じカテゴリの公開記事を新しい順に取得 */
export async function fetchRelatedPosts(post: Post, limit = 4): Promise<Post[]> {
  const categoryIds = getCategoryIds(post)
  if (categoryIds.length === 0) return []

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    depth: 2,
    limit,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { id: { not_equals: post.id } },
        {
          or: categoryIds.map((id) => ({
            categories: { contains: id },
          })),
        },
      ],
    },
  })

  return result.docs
}
