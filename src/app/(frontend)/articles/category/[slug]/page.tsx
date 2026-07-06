import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { ArchivePage } from '@/components/animemiru/ArchivePage'
import { toBreadcrumbJsonLd } from '@/components/animemiru/Breadcrumbs'
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/animemiru/JsonLd'
import { fetchPopularPosts } from '@/lib/fetchPopularPosts'
import { getCategoryDescription } from '@/lib/articleSeo'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

const POSTS_PER_PAGE = 18

type Args = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })

  return categories.docs.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params, searchParams }: Args) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const decodedSlug = decodeURIComponent(slug)

  const payload = await getPayload({ config: configPromise })

  const categoryResult = await payload.find({
    collection: 'categories',
    limit: 1,
    where: { slug: { equals: decodedSlug } },
  })

  const category = categoryResult.docs[0]
  if (!category) notFound()

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
  const basePath = `/articles/category/${category.slug}`
  const categoryUrl = `${siteUrl}${basePath}`
  const description = getCategoryDescription(category.title, category.description)

  const breadcrumbUi = [
    { name: 'アニメミル', href: '/' },
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

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    limit: 1,
    where: { slug: { equals: decodeURIComponent(slug) } },
  })

  const category = result.docs[0]
  if (!category) return { title: 'カテゴリが見つかりません' }

  const url = `${getServerSideURL()}/articles/category/${category.slug}`
  const title = category.title
  const description = getCategoryDescription(category.title, category.description)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: mergeOpenGraph({ title: `${title} | アニメミル`, description, url }),
  }
}
