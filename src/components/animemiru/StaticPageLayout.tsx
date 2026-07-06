import Link from 'next/link'
import type { ReactNode } from 'react'

import { AnimemiruBreadcrumbs, type BreadcrumbItem } from '@/components/animemiru/Breadcrumbs'
import { AnimemiruHeader } from '@/components/animemiru/Header'
import { AnimemiruSidebar } from '@/components/animemiru/Sidebar'
import { SnsShare } from '@/components/animemiru/SnsShare'
import type { Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

type Props = {
  author?: boolean
  breadcrumbItems?: BreadcrumbItem[]
  children: ReactNode
  path: string
  popularPosts: Post[]
  title: string
  updatedAt?: string
}

export function StaticPageLayout({
  author = true,
  breadcrumbItems,
  children,
  path,
  popularPosts,
  title,
  updatedAt,
}: Props) {
  const shareUrl = `${getServerSideURL()}${path}`
  const breadcrumbs = breadcrumbItems ?? [
    { name: 'アニメミル', href: '/' },
    { name: title },
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
                <div className="st-post post" id="st-page">
                  <AnimemiruBreadcrumbs items={breadcrumbs} />

                  <h1 className="entry-title">{title}</h1>

                  <SnsShare title={title} url={shareUrl} />

                  <div className="mainbox">
                    <div id="nocopy">
                      <div className="entry-content">{children}</div>
                    </div>
                  </div>

                  {updatedAt && (
                    <div className="blogbox">
                      <p>
                        <span className="kdate">
                          更新日：
                          <time className="updated" dateTime={updatedAt}>
                            {updatedAt.slice(0, 10)}
                          </time>
                        </span>
                      </p>
                    </div>
                  )}

                  {author && (
                    <p className="author">
                      執筆者:
                      <Link href="/articles/author/editor" title="animemiru編集部">
                        <span className="fn">animemiru編集部</span>
                      </Link>
                    </p>
                  )}
                </div>
              </article>
            </main>
          </div>
          <AnimemiruSidebar popularPosts={popularPosts} />
        </div>
      </div>
    </>
  )
}
