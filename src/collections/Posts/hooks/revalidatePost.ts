import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path)
    revalidateTag('posts-sitemap')
  } catch {
    // 移行スクリプト等、Next.js リクエストコンテキスト外では revalidate 不可
  }
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.wpId ? `/articles/${doc.wpId}` : `/articles/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      safeRevalidatePath(path)
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.wpId
        ? `/articles/${previousDoc.wpId}`
        : `/articles/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      safeRevalidatePath(oldPath)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = doc?.wpId ? `/articles/${doc.wpId}` : `/articles/${doc?.slug}`

    safeRevalidatePath(path)
  }

  return doc
}
