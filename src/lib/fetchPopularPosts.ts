import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function fetchPopularPosts(limit = 10) {
  const payload = await getPayload({ config: configPromise })

  const ranked = await payload.find({
    collection: 'posts',
    depth: 2,
    limit,
    overrideAccess: false,
    pagination: false,
    sort: '-viewCount',
    where: {
      and: [{ _status: { equals: 'published' } }, { viewCount: { greater_than: 0 } }],
    },
  })

  if (ranked.docs.length >= limit) {
    return ranked.docs
  }

  const fallback = await payload.find({
    collection: 'posts',
    depth: 2,
    limit,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })

  const seen = new Set(ranked.docs.map((post) => post.id))
  const merged = [...ranked.docs]

  for (const post of fallback.docs) {
    if (seen.has(post.id)) continue
    merged.push(post)
    if (merged.length >= limit) break
  }

  return merged
}
