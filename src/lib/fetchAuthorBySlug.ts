import config from '@payload-config'
import { getPayload } from 'payload'

import {
  DEFAULT_AUTHOR_PROFILE,
  DEFAULT_AUTHOR_SLUG,
  userToAuthorProfile,
  type AuthorProfile,
} from '@/lib/authorProfile'

export async function fetchAuthorBySlug(slug: string): Promise<AuthorProfile | null> {
  if (slug === DEFAULT_AUTHOR_SLUG) {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'users',
      limit: 1,
      overrideAccess: true,
      where: { authorSlug: { equals: DEFAULT_AUTHOR_SLUG } },
    })

    if (result.docs[0]) {
      return userToAuthorProfile(result.docs[0])
    }

    return DEFAULT_AUTHOR_PROFILE
  }

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    where: { authorSlug: { equals: slug } },
  })

  if (!result.docs[0]) return null
  return userToAuthorProfile(result.docs[0])
}
