import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AnimemiruBreadcrumbs, toBreadcrumbJsonLd } from '@/components/animemiru/Breadcrumbs'
import { AnimemiruHeader } from '@/components/animemiru/Header'
import { BreadcrumbJsonLd, PersonJsonLd } from '@/components/animemiru/JsonLd'
import { AnimemiruSidebar } from '@/components/animemiru/Sidebar'
import { SnsShare } from '@/components/animemiru/SnsShare'
import { fetchAuthorBySlug } from '@/lib/fetchAuthorBySlug'
import { fetchPopularPosts } from '@/lib/fetchPopularPosts'
import { generateStaticPageMeta } from '@/utilities/generateStaticPageMeta'
import { getServerSideURL } from '@/utilities/getURL'
import { shouldSkipBuildStaticGeneration } from '@/utilities/shouldSkipBuildStaticGeneration'

type Args = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  if (shouldSkipBuildStaticGeneration()) return []
  return [{ slug: 'editor' }]
}

export default async function AuthorPage({ params }: Args) {
  const { slug } = await params
  const author = await fetchAuthorBySlug(slug)
  if (!author) notFound()

  const popularPosts = await fetchPopularPosts()
  const siteUrl = getServerSideURL()
  const path = `/articles/author/${author.slug}`
  const shareUrl = `${siteUrl}${path}`

  const breadcrumbUi = [
    { name: 'アニメミル', href: '/' },
    { name: author.name },
  ]

  return (
    <>
      <PersonJsonLd author={author} url={shareUrl} />
      <BreadcrumbJsonLd items={toBreadcrumbJsonLd(breadcrumbUi, siteUrl)} />
      <header id="">
        <AnimemiruHeader />
      </header>

      <div id="content-w">
        <div className="clearfix" id="content">
          <div id="contentInner">
            <main>
              <article>
                <div className="st-post post" id="st-page">
                  <AnimemiruBreadcrumbs items={breadcrumbUi} />
                  <h1 className="entry-title">{author.name}</h1>
                  <SnsShare title={`${author.name} | アニメミル`} url={shareUrl} />

                  <div className="mainbox">
                    <div className="st-author-box author-page-box">
                      <dl>
                        <dt>
                          <img
                            alt={author.name}
                            className="avatar avatar-120 photo"
                            height={120}
                            src={author.imageUrl}
                            width={120}
                          />
                        </dt>
                        <dd>
                          <p className="author-job">{author.jobTitle}</p>
                          <p className="author-description">{author.description}</p>
                          {author.sameAs.length > 0 && (
                            <ul className="author-sns">
                              {author.sameAs.map((href) => (
                                <li key={href}>
                                  <a href={href} rel="nofollow noopener noreferrer" target="_blank">
                                    {href.includes('twitter') ? 'Twitter' : 'SNS'}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>

                  <p className="author-back">
                    <Link href="/">← トップページへ</Link>
                  </p>
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

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const author = await fetchAuthorBySlug(slug)
  if (!author) return { title: '著者が見つかりません' }

  return generateStaticPageMeta(author.name, `/articles/author/${author.slug}`, author.description)
}
