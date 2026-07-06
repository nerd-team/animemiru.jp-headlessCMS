import type { Metadata } from 'next'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

import { StaticPageLayout } from '@/components/animemiru/StaticPageLayout'
import { fetchPopularPosts } from '@/lib/fetchPopularPosts'
import { generateStaticPageMeta } from '@/utilities/generateStaticPageMeta'
import { getPostHref } from '@/utilities/getPostHref'
import { getCategoryHref } from '@/utilities/categorySlug'

export const metadata: Metadata = generateStaticPageMeta(
  'サイトマップ',
  '/sitemap',
  'アニメミルのサイトマップ。固定ページ・カテゴリ・最新記事へのリンク一覧です。',
)

export default async function SitemapPage() {
  const payload = await getPayload({ config: configPromise })

  const [categories, posts, popularPosts] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 1000,
      pagination: false,
      sort: 'title',
    }),
    payload.find({
      collection: 'posts',
      depth: 0,
      limit: 50,
      pagination: false,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
    }),
    fetchPopularPosts(),
  ])

  return (
    <StaticPageLayout
      path="/sitemap"
      popularPosts={popularPosts}
      title="サイトマップ"
      updatedAt={new Date().toISOString()}
    >
      <section className="sitemap-section">
        <h2>固定ページ</h2>
        <ul>
          <li>
            <Link href="/">トップページ</Link>
          </li>
          <li>
            <Link href="/contact">お問い合わせ</Link>
          </li>
          <li>
            <Link href="/terms">利用規約</Link>
          </li>
          <li>
            <Link href="/search">記事検索</Link>
          </li>
          <li>
            <Link href="/articles/category">カテゴリ一覧</Link>
          </li>
          <li>
            <Link href="/feed.xml">RSS フィード</Link>
          </li>
        </ul>
      </section>

      {categories.docs.length > 0 && (
        <section className="sitemap-section">
          <h2>カテゴリ</h2>
          <ul>
            {categories.docs.map((category) => (
              <li key={category.id}>
                <Link href={getCategoryHref(category.slug)}>{category.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {posts.docs.length > 0 && (
        <section className="sitemap-section">
          <h2>最新記事</h2>
          <ul>
            {posts.docs.map((post) => (
              <li key={post.id}>
                <Link href={getPostHref(post)}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </StaticPageLayout>
  )
}
