import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { isDevOnlyRouteAllowed } from '@/lib/devOnlyRoute'

/** 開発用: 記事数の確認 */
export async function GET() {
  if (!isDevOnlyRouteAllowed()) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const payload = await getPayload({ config })

  const [all, published, drafts, recentDrafts, recentPublished] = await Promise.all([
    payload.find({ collection: 'posts', limit: 0, overrideAccess: true }),
    payload.find({
      collection: 'posts',
      limit: 0,
      overrideAccess: true,
      where: { _status: { equals: 'published' } },
    }),
    payload.find({
      collection: 'posts',
      limit: 0,
      overrideAccess: true,
      where: { _status: { equals: 'draft' } },
    }),
    payload.find({
      collection: 'posts',
      limit: 10,
      overrideAccess: true,
      sort: '-updatedAt',
      where: { _status: { equals: 'draft' } },
      select: { title: true, slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'posts',
      limit: 5,
      overrideAccess: true,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
      select: { title: true, slug: true, publishedAt: true },
    }),
  ])

  const hint =
    drafts.totalDocs > 0 && published.totalDocs === 0
      ? '下書きのみあります。管理画面で「公開」ボタンを押してください。'
      : drafts.totalDocs > 0
        ? `公開済み ${published.totalDocs} 件、下書き ${drafts.totalDocs} 件。下書きはサイトに表示されません。`
        : all.totalDocs === 0
          ? '/next/seed-demo でデモ記事を投入してください。'
          : 'OK'

  return NextResponse.json({
    total: all.totalDocs,
    published: published.totalDocs,
    drafts: drafts.totalDocs,
    draftPosts: recentDrafts.docs.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      editUrl: `/admin/collections/posts/${p.id}`,
    })),
    recentPublished: recentPublished.docs.map((p) => ({
      title: p.title,
      slug: p.slug,
      url: p.slug ? `/articles/${p.slug}` : null,
    })),
    adminPosts: '/admin/collections/posts',
    seedDemo: '/next/seed-demo',
    siteUrl: '/',
    hint,
  })
}
