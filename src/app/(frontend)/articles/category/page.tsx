import type { Metadata } from 'next'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { AnimemiruBreadcrumbs } from '@/components/animemiru/Breadcrumbs'
import { AnimemiruHeader } from '@/components/animemiru/Header'
import { AnimemiruSidebar } from '@/components/animemiru/Sidebar'
import { fetchPopularPosts } from '@/lib/fetchPopularPosts'
import { getCategoryHref } from '@/utilities/categorySlug'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'カテゴリ一覧',
  description: 'アニメミルの記事カテゴリ一覧です。',
  alternates: { canonical: `${getServerSideURL()}/articles/category` },
  openGraph: mergeOpenGraph({
    title: 'カテゴリ一覧 | アニメミル',
    description: 'アニメミルの記事カテゴリ一覧です。',
    url: `${getServerSideURL()}/articles/category`,
  }),
}

export default async function CategoryIndexPage() {
  const payload = await getPayload({ config: configPromise })
  const [categories, popularPosts] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 1000,
      pagination: false,
      sort: 'title',
    }),
    fetchPopularPosts(),
  ])

  const breadcrumbs = [
    { name: 'アニメミル', href: '/' },
    { name: 'カテゴリ一覧' },
  ]

  return (
    <>
      <header id="">
        <AnimemiruHeader />
      </header>

      <div id="content-w">
        <div className="clearfix" id="content">
          <div id="contentInner">
            <main>
              <article>
                <div className="st-post post">
                  <AnimemiruBreadcrumbs items={breadcrumbs} />
                  <h1 className="entry-title">カテゴリ一覧</h1>
                  <p className="archive-description">
                    作品名・ジャンル別の記事カテゴリです。カテゴリ名をクリックすると記事一覧が表示されます。
                  </p>
                </div>

                <section className="category-index">
                  <ul className="category-index-list">
                    {categories.docs.map((category) => (
                      <li key={category.id}>
                        <Link href={getCategoryHref(category.slug)}>{category.title}</Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </article>
            </main>
          </div>
          <AnimemiruSidebar popularPosts={popularPosts} />
        </div>
      </div>
    </>
  )
}
