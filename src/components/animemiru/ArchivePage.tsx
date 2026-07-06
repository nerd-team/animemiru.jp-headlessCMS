import type { Post } from '@/payload-types'



import { ArticleList } from '@/components/animemiru/ArticleList'

import { AnimemiruBreadcrumbs, type BreadcrumbItem } from '@/components/animemiru/Breadcrumbs'

import { AnimemiruHeader } from '@/components/animemiru/Header'

import { AnimemiruSidebar } from '@/components/animemiru/Sidebar'

import { SnsTop } from '@/components/animemiru/SnsTop'

import { Pagination } from '@/components/Pagination'



type Props = {

  breadcrumbItems?: BreadcrumbItem[]

  page: number

  posts: Post[]

  popularPosts: Post[]

  title: string

  totalPages: number

  basePath: string

  description?: string

  query?: string

}



export function ArchivePage({

  basePath,

  breadcrumbItems,

  description,

  page,

  popularPosts,

  posts,

  query,

  title,

  totalPages,

}: Props) {

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

                <div className="st-post post">

                  <AnimemiruBreadcrumbs items={breadcrumbs} />

                  <h1 className="entry-title">{title}</h1>

                  {description && <p className="archive-description">{description}</p>}

                </div>



                <aside>

                  <ArticleList posts={posts} />

                  {totalPages > 1 && (

                    <Pagination

                      basePath={basePath}

                      page={page}

                      query={query}

                      totalPages={totalPages}

                    />

                  )}

                </aside>



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

