import config from '@payload-config'
import { getPayload } from 'payload'

import { normalizeCategorySlug } from '@/utilities/categorySlug'

export async function repairCategorySlugs() {
  const payload = await getPayload({ config })
  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
    pagination: false,
  })

  let updated = 0

  for (const category of categories.docs) {
    const normalized = normalizeCategorySlug(category.slug)
    if (!normalized || normalized === category.slug) continue

    await payload.update({
      collection: 'categories',
      id: category.id,
      data: { slug: normalized },
      overrideAccess: true,
    })
    updated++
  }

  return { message: 'Category slugs repaired', updated, total: categories.docs.length }
}
