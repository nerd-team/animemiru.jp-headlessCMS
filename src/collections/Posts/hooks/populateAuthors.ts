import type { CollectionAfterReadHook } from 'payload'

import { userToAuthorProfile } from '@/lib/authorProfile'
import type { User } from '@/payload-types'

export const populateAuthors: CollectionAfterReadHook = async ({ doc, req: { payload } }) => {
  if (!doc?.authors?.length) return doc

  const authorDocs: User[] = []

  for (const author of doc.authors) {
    try {
      const authorDoc = await payload.findByID({
        id: typeof author === 'object' ? author?.id : author,
        collection: 'users',
        depth: 1,
      })

      if (authorDoc) authorDocs.push(authorDoc)
    } catch {
      // ignore missing user
    }
  }

  if (authorDocs.length > 0) {
    doc.populatedAuthors = authorDocs.map((authorDoc) => {
      const profile = userToAuthorProfile(authorDoc)
      return {
        id: authorDoc.id,
        name: profile.name,
        slug: profile.slug,
        description: profile.description,
        imageUrl: profile.imageUrl,
        jobTitle: profile.jobTitle,
        sameAs: profile.sameAs,
      }
    })
  }

  return doc
}
