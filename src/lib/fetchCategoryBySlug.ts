import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Category } from '@/payload-types'
import { categorySlugLookupValues, normalizeCategorySlug } from '@/utilities/categorySlug'

function slugVariantsMatch(a: string, b: string): boolean {
  const aSet = new Set(categorySlugLookupValues(a))
  for (const variant of categorySlugLookupValues(b)) {
    if (aSet.has(variant)) return true
  }
  return false
}

export async function fetchCategoryBySlug(slugParam: string): Promise<Category | null> {
  const payload = await getPayload({ config: configPromise })
  const variants = categorySlugLookupValues(slugParam)
  const normalizedParam = normalizeCategorySlug(slugParam)

  for (const slug of variants) {
    const result = await payload.find({
      collection: 'categories',
      limit: 1,
      where: { slug: { equals: slug } },
    })

    if (result.docs[0]) return result.docs[0]
  }

  if (normalizedParam) {
    const byTitle = await payload.find({
      collection: 'categories',
      limit: 1,
      where: { title: { equals: normalizedParam } },
    })

    if (byTitle.docs[0]) return byTitle.docs[0]
  }

  const all = await payload.find({
    collection: 'categories',
    limit: 1000,
    pagination: false,
  })

  return (
    all.docs.find(
      (category) =>
        slugVariantsMatch(slugParam, category.slug) ||
        (normalizedParam !== '' &&
          (normalizeCategorySlug(category.slug) === normalizedParam ||
            category.title === normalizedParam)),
    ) ?? null
  )
}
