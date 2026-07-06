import config from '@payload-config'
import { getPayload } from 'payload'

export async function incrementViewCount(postId: string) {
  const payload = await getPayload({ config })

  const post = await payload.findByID({
    collection: 'posts',
    id: postId,
    depth: 0,
  })

  if (!post || post._status !== 'published') return

  await payload.update({
    collection: 'posts',
    id: postId,
    overrideAccess: true,
    data: {
      viewCount: (post.viewCount || 0) + 1,
    },
  })
}
