import type { Metadata } from 'next'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

import { AnimemiruBreadcrumbs, toBreadcrumbJsonLd } from '@/components/animemiru/Breadcrumbs'
import { BreadcrumbJsonLd } from '@/components/animemiru/JsonLd'
import { StaticPageLayout } from '@/components/animemiru/StaticPageLayout'
import { fetchPopularPosts } from '@/lib/fetchPopularPosts'
import { POPULAR_TAGS } from '@/lib/popularTags'
import { SITE_DESCRIPTION } from '@/lib/siteConfig'
import { generateStaticPageMeta } from '@/utilities/generateStaticPageMeta'
import { getServerSideURL } from '@/utilities/getURL'

export const metadata: Metadata = generateStaticPageMeta(
  'アニメ用語・タグ一覧',
  '/anime-glossary',
  'アニメミルで扱う人気タグ・キーワード一覧。キャラクターランキング・考察・ネタバレなどの記事を探す入口ページです。',
)

export default async function AnimeGlossaryPage() {
  const payload = await getPayload({ config: configPromise })
  const [categories, popularPosts] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 100,
      pagination: false,
      sort: 'title',
    }),
    fetchPopularPosts(),
  ])

  const siteUrl = getServerSideURL()
  const breadcrumbUi = [
    { name: 'アニメミル', href: '/' },
    { name: 'アニメ用語・タグ一覧' },
  ]

  return (
    <>
      <BreadcrumbJsonLd items={toBreadcrumbJsonLd(breadcrumbUi, siteUrl)} />
      <StaticPageLayout
        author={false}
        path="/anime-glossary"
        popularPosts={popularPosts}
        title="アニメ用語・タグ一覧"
      >
        <p>{SITE_DESCRIPTION}</p>

        <section className="sitemap-section">
          <h2>人気タグ</h2>
          <p className="tagcloud">
            {POPULAR_TAGS.map((tag) => (
              <Link href={`/search?s=${encodeURIComponent(tag)}`} key={tag}>
                {tag}
              </Link>
            ))}
          </p>
        </section>

        {categories.docs.length > 0 && (
          <section className="sitemap-section">
            <h2>作品・カテゴリ一覧</h2>
            <ul>
              {categories.docs.map((category) => (
                <li key={category.id}>
                  <Link href={`/articles/category/${category.slug}`}>{category.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </StaticPageLayout>
    </>
  )
}
