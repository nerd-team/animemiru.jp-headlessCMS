import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Category } from '@/payload-types'
import { categorySlugLookupValues } from '@/utilities/categorySlug'

export async function fetchCategoryBySlug(slugParam: string): Promise<Category | null> {
  const payload = await getPayload({ config: configPromise })
  const variants = categorySlugLookupValues(slugParam)

  for (const slug of variants) {
    const result = await payload.find({
      collection: 'categories',
      limit: 1,
      where: { slug: { equals: slug } },
    })

    if (result.docs[0]) return result.docs[0]
  }

  return null
}
