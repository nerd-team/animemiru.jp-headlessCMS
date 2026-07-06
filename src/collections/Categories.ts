import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'カテゴリ',
    plural: 'カテゴリ',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'カテゴリ名',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'カテゴリ説明',
      admin: {
        description: 'SEO用。空の場合は自動生成されます。',
      },
    },
    slugField({
      position: undefined,
    }),
  ],
}
