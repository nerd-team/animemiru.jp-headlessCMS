import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { assignAuthorOnCreate } from './hooks/assignAuthorOnCreate'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'
import { setModifiedAt } from './hooks/setModifiedAt'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: '\u8a18\u4e8b',
    plural: '\u8a18\u4e8b',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', '_status', 'categories', 'publishedAt', 'updatedAt'],
    description:
      '\u300c\u516c\u958b\u300d\u30dc\u30bf\u30f3\u3092\u62bc\u3059\u307e\u3067\u30b5\u30a4\u30c8\u306b\u306f\u8868\u793a\u3055\u308c\u307e\u305b\u3093\u3002',
    group: '\u30b3\u30f3\u30c6\u30f3\u30c4',
    listSearchableFields: ['title', 'excerpt', 'slug'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'posts',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'posts',
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '\u30bf\u30a4\u30c8\u30eb',
      required: true,
      admin: {
        placeholder: '\u30bf\u30a4\u30c8\u30eb\u3092\u8ffd\u52a0',
      },
    },
    {
      name: 'contentHtml',
      type: 'code',
      label: '\u672c\u6587',
      admin: {
        language: 'html',
        description:
          'HTML\u3067\u672c\u6587\u3092\u5165\u529b\u3057\u307e\u3059\u3002WordPress\u306e\u30af\u30e9\u30b7\u30c3\u30af\u30a8\u30c7\u30a3\u30bf\u3068\u540c\u69d8\u3067\u3059\u3002',
        editorOptions: {
          lineNumbers: 'on',
          minimap: { enabled: false },
          wordWrap: 'on',
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        },
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: '\u629c\u7c8b',
      admin: {
        description: '\u30c8\u30c3\u30d7\u30da\u30fc\u30b8\u30fb\u4e00\u89a7\u306b\u8868\u793a\u3055\u308c\u308b\u8981\u7d04\u6587\u3067\u3059\u3002',
        rows: 4,
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      label: '\u30ab\u30c6\u30b4\u30ea',
      hasMany: true,
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      label: '\u30a2\u30a4\u30ad\u30e3\u30c3\u30c1\u753b\u50cf',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: '\u516c\u958b\u65e5\u6642',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        description: '\u7a7a\u6b04\u306e\u307e\u307e\u516c\u958b\u3059\u308b\u3068\u73fe\u5728\u6642\u523b\u304c\u8a2d\u5b9a\u3055\u308c\u307e\u3059\u3002',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'modifiedAt',
      type: 'date',
      label: '\u66f4\u65b0\u65e5\u6642',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        readOnly: true,
        description: '\u4fdd\u5b58\u6642\u306b\u81ea\u52d5\u66f4\u65b0\u3055\u308c\u307e\u3059\u3002',
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      label: '\u57f7\u7b46\u8005',
      hasMany: true,
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: '\u30ed\u30b0\u30a4\u30f3\u30e6\u30fc\u30b6\u30fc\u304c\u81ea\u52d5\u8a2d\u5b9a\u3055\u308c\u307e\u3059\u3002',
      },
    },
    slugField(),
    {
      type: 'collapsible',
      label: 'SEO\u8a2d\u5b9a',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'meta',
          label: 'SEO',
          type: 'group',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '\u8a73\u7d30\u8a2d\u5b9a',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'wpId',
          type: 'number',
          label: 'WordPress \u8a18\u4e8bID',
          unique: true,
          admin: {
            description: '\u79fb\u884c\u8a18\u4e8b\u306eURL /articles/{wpId} \u306b\u4f7f\u7528',
          },
        },
        {
          name: 'viewCount',
          type: 'number',
          label: '\u30a2\u30af\u30bb\u30b9\u6570',
          defaultValue: 0,
          admin: {
            description: '\u30a2\u30af\u30bb\u30b9\u30e9\u30f3\u30ad\u30f3\u30b0\u7528',
            readOnly: true,
          },
        },
        {
          name: 'content',
          type: 'richText',
          label: '\u30ea\u30c3\u30c1\u30c6\u30ad\u30b9\u30c8\uff08\u4e88\u5099\uff09',
          editor: lexicalEditor(),
          admin: {
            description: '\u901a\u5e38\u306f\u300c\u672c\u6587\u300dHTML\u3092\u4f7f\u7528\u3057\u307e\u3059\u3002',
          },
        },
      ],
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
        readOnly: true,
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'name', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'imageUrl', type: 'text' },
        { name: 'jobTitle', type: 'text' },
        { name: 'sameAs', type: 'json' },
      ],
    },
  ],
  hooks: {
    beforeChange: [assignAuthorOnCreate, setModifiedAt],
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
