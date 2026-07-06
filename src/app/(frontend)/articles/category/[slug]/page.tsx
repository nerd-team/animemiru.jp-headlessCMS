import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { ArchivePage } from '@/components/animemiru/ArchivePage'
import { toBreadcrumbJsonLd } from '@/components/animemiru/Breadcrumbs'
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/animemiru/JsonLd'
import { fetchCategoryBySlug } from '@/lib/fetchCategoryBySlug'
import { fetchPopularPosts } from '@/lib/fetchPopularPosts'
import { getCategoryDescription } from '@/lib/articleSeo'
import { getCategoryHref } from '@/utilities/categorySlug'
import { buildPaginatedMetadata, parsePageParam } from '@/utilities/paginationMeta'
import { getServerSideURL } from '@/utilities/getURL'

const POSTS_PER_PAGE = 18

export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Args = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export default async function CategoryPage({ params, searchParams }: Args) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const category = await fetchCategoryBySlug(slug)
  if (!category) notFound()

  const payload = await getPayload({ config: configPromise })

  const [postsResult, popularPosts] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 2,
      limit: POSTS_PER_PAGE,
      page,
      sort: '-publishedAt',
      where: {
        _status: { equals: 'published' },
        categories: { contains: category.id },
      },
    }),
    fetchPopularPosts(),
  ])

  const siteUrl = getServerSideURL()
  const basePath = getCategoryHref(category.slug)
  const categoryUrl = `${siteUrl}${basePath}`
  const description = getCategoryDescription(category.title, category.description)

  const breadcrumbUi = [
    { name: 'アニメミル', href: '/' },
    { name: 'カテゴリ一覧', href: '/articles/category' },
    { name: category.title },
  ]

  return (
    <>
      <CollectionPageJsonLd description={description} name={category.title} url={categoryUrl} />
      <BreadcrumbJsonLd items={toBreadcrumbJsonLd(breadcrumbUi, siteUrl)} />
      <ArchivePage
        basePath={basePath}
        breadcrumbItems={breadcrumbUi}
        description={description}
        page={page}
        popularPosts={popularPosts}
        posts={postsResult.docs}
        title={category.title}
        totalPages={postsResult.totalPages}
      />
    </>
  )
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = parsePageParam(pageParam)
  const category = await fetchCategoryBySlug(slug)

  if (!category) return { title: 'カテゴリが見つかりません' }

  const basePath = getCategoryHref(category.slug)
  const title = category.title
  const description = getCategoryDescription(category.title, category.description)
  const siteUrl = getServerSideURL()

  return buildPaginatedMetadata({
    basePath,
    description,
    openGraphTitle: `${title} | アニメミル`,
    page,
    siteUrl,
    title: page > 1 ? `${title}（${page}ページ目）` : title,
  })
}
