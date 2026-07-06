import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'ユーザー',
    plural: 'ユーザー',
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['displayName', 'email', 'authorSlug'],
    group: '設定',
    useAsTitle: 'displayName',
  },
  auth: true,
  fields: [
    {
      name: 'displayName',
      type: 'text',
      label: '表示名',
      admin: {
        description: '記事に表示される名前（例: animemiru編集部）',
      },
    },
    {
      name: 'name',
      type: 'text',
      label: '管理用名前',
    },
    {
      name: 'authorSlug',
      type: 'text',
      label: '執筆者URLスラッグ',
      defaultValue: 'editor',
      admin: {
        description: '執筆者ページ URL: /articles/author/{authorSlug}',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: '自己紹介',
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: '肩書き',
      defaultValue: '編集者',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'プロフィール画像',
    },
    {
      name: 'twitter',
      type: 'text',
      label: 'Twitter URL',
    },
    {
      name: 'facebook',
      type: 'text',
      label: 'Facebook URL',
    },
    {
      name: 'instagram',
      type: 'text',
      label: 'Instagram URL',
    },
    {
      name: 'homepage',
      type: 'text',
      label: 'ホームページ URL',
    },
  ],
  timestamps: true,
  versions: false,
}
