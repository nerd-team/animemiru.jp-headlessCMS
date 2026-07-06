import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { ArchivePage } from '@/components/animemiru/ArchivePage'
import { toBreadcrumbJsonLd } from '@/components/animemiru/Breadcrumbs'
import { BreadcrumbJsonLd } from '@/components/animemiru/JsonLd'
import { fetchPopularPosts } from '@/lib/fetchPopularPosts'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

const POSTS_PER_PAGE = 18

type Args = {
  searchParams: Promise<{ page?: string; q?: string; s?: string }>
}

export default async function SearchPage({ searchParams }: Args) {
  const { page: pageParam, q, s } = await searchParams
  const query = (s || q || '').trim()
  const page = Math.max(1, Number(pageParam) || 1)

  const payload = await getPayload({ config: configPromise })

  const [postsResult, popularPosts] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 2,
      limit: POSTS_PER_PAGE,
      page,
      sort: '-publishedAt',
      where: query
        ? {
            and: [
              { _status: { equals: 'published' } },
              {
                or: [
                  { title: { like: query } },
                  { excerpt: { like: query } },
                  { slug: { like: query } },
                ],
              },
            ],
          }
        : { _status: { equals: 'published' } },
    }),
    fetchPopularPosts(),
  ])

  const basePath = '/search'
  const title = query ? `「${query}」の検索結果` : '記事検索'
  const description = query
    ? `${postsResult.totalDocs}件の記事が見つかりました`
    : 'キーワードを入力して記事を検索できます'

  const breadcrumbUi = [
    { name: 'アニメミル', href: '/' },
    { name: title },
  ]

  return (
    <>
      <BreadcrumbJsonLd items={toBreadcrumbJsonLd(breadcrumbUi, getServerSideURL())} />
      <ArchivePage
        basePath={basePath}
        breadcrumbItems={breadcrumbUi}
        description={description}
        page={page}
        popularPosts={popularPosts}
        posts={postsResult.docs}
        query={query || undefined}
        title={title}
        totalPages={postsResult.totalPages}
      />
    </>
  )
}

export function generateMetadata({ searchParams }: Args): Promise<Metadata> {
  return searchParams.then(({ q, s }) => {
    const query = (s || q || '').trim()
    const title = query ? `「${query}」の検索結果` : '記事検索'
    const url = query
      ? `${getServerSideURL()}/search?s=${encodeURIComponent(query)}`
      : `${getServerSideURL()}/search`

    return {
      title,
      alternates: { canonical: url },
      openGraph: mergeOpenGraph({ title: `${title} | アニメミル`, url }),
      robots: query ? { index: false, follow: true } : undefined,
    }
  })
}
