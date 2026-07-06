import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { ArticleList } from '@/components/animemiru/ArticleList'
import { WebSiteJsonLd } from '@/components/animemiru/JsonLd'
import { AnimemiruHomeHeader } from '@/components/animemiru/HomeHeader'
import { AnimemiruSidebar } from '@/components/animemiru/Sidebar'
import { SnsTop } from '@/components/animemiru/SnsTop'
import { YouTubeShortsWidget } from '@/components/animemiru/SidebarWidgets'
import { Pagination } from '@/components/Pagination'
import { fetchPopularPosts } from '@/lib/fetchPopularPosts'
import { SITE_DESCRIPTION, SITE_TAGLINE } from '@/lib/siteConfig'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

export const metadata: Metadata = {
  title: SITE_TAGLINE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: getServerSideURL() },
  openGraph: mergeOpenGraph({
    title: SITE_TAGLINE,
    url: getServerSideURL(),
  }),
}

const POSTS_PER_PAGE = 18

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const payload = await getPayload({ config: configPromise })

  const [postsResult, sliderResult, popularPosts] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 2,
      limit: POSTS_PER_PAGE,
      page,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
    }),
    payload.find({
      collection: 'posts',
      depth: 2,
      limit: 10,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
    }),
    fetchPopularPosts(),
  ])

  return (
    <>
      <WebSiteJsonLd url={getServerSideURL()} />
      <AnimemiruHomeHeader posts={sliderResult.docs} showSlider={page === 1} />

      <div id="content-w">
        <div className="clearfix" id="content">
          <div id="contentInner">
            <main>
              <article>
                <div className="home-post post" />

                <aside>
                  <ArticleList posts={postsResult.docs} />
                  {postsResult.totalPages > 1 && (
                    <Pagination page={page} totalPages={postsResult.totalPages} basePath="/" />
                  )}
                </aside>

                <YouTubeShortsWidget />

                <SnsTop />
              </article>
            </main>
          </div>
          <AnimemiruSidebar popularPosts={popularPosts} />
        </div>
      </div>
    </>
  )
}
