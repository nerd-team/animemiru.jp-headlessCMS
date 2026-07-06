import type { Metadata } from 'next'

import configPromise from '@payload-config'

import Link from 'next/link'

import { draftMode } from 'next/headers'

import { cache } from 'react'

import { getPayload, type Where } from 'payload'



import { PayloadRedirects } from '@/components/PayloadRedirects'

import { AnimemiruHeader } from '@/components/animemiru/Header'

import { ArticleSummary } from '@/components/animemiru/ArticleSummary'

import { AuthorBox } from '@/components/animemiru/AuthorBox'

import { AnimemiruBreadcrumbs, toBreadcrumbJsonLd } from '@/components/animemiru/Breadcrumbs'

import { RelatedPosts } from '@/components/animemiru/RelatedPosts'

import { AnimemiruSidebar } from '@/components/animemiru/Sidebar'

import { SnsShare } from '@/components/animemiru/SnsShare'

import RichText from '@/components/RichText'

import { LivePreviewListener } from '@/components/LivePreviewListener'

import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/animemiru/JsonLd'

import { ViewTracker } from '@/components/animemiru/ViewTracker'

import { fetchPopularPosts } from '@/lib/fetchPopularPosts'

import { fetchRelatedPosts } from '@/lib/fetchRelatedPosts'
import { getAuthorProfileFromPost } from '@/lib/authorProfile'

import { generateMeta } from '@/utilities/generateMeta'

import { formatArticleDate } from '@/utilities/formatDateTime'

import { getPostCanonicalUrl } from '@/utilities/getPostCanonicalUrl'

import { getPostImageUrl } from '@/utilities/getPostImageUrl'

import { getServerSideURL } from '@/utilities/getURL'
import { shouldSkipBuildStaticGeneration } from '@/utilities/shouldSkipBuildStaticGeneration'

import type { Post } from '@/payload-types'



export async function generateStaticParams() {
  if (shouldSkipBuildStaticGeneration()) return []

  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({

    collection: 'posts',

    draft: false,

    limit: 1000,

    overrideAccess: false,

    pagination: false,

    select: { slug: true, wpId: true },

  })



  return posts.docs.flatMap((post) => {

    const params: { slug: string }[] = []

    if (post.slug) params.push({ slug: post.slug })

    if (post.wpId) params.push({ slug: String(post.wpId) })

    return params

  })

}



type Args = {

  params: Promise<{ slug?: string }>

}



export default async function ArticlePage({ params: paramsPromise }: Args) {

  const { isEnabled: draft } = await draftMode()

  const { slug = '' } = await paramsPromise

  const decodedSlug = decodeURIComponent(slug)

  const url = `/articles/${decodedSlug}`

  const post = await queryPost(decodedSlug)



  if (!post) return <PayloadRedirects url={url} />



  const category = post.categories?.[0]

  const categoryTitle =

    typeof category === 'object' && category !== null ? category.title : null

  const categorySlug =

    typeof category === 'object' && category !== null ? category.slug : null



  const [popularPosts, relatedPosts] = await Promise.all([

    fetchPopularPosts(),

    fetchRelatedPosts(post),

  ])



  const siteUrl = getServerSideURL()

  const shareUrl = getPostCanonicalUrl(post)

  const imageUrl = getPostImageUrl(post).startsWith('http')

    ? getPostImageUrl(post)

    : `${siteUrl}${getPostImageUrl(post)}`



  const modifiedAt = post.modifiedAt || post.updatedAt
  const authorProfile = getAuthorProfileFromPost(post)

  const breadcrumbUi = [

    { name: 'アニメミル', href: '/' },

    ...(categoryTitle && categorySlug

      ? [{ name: categoryTitle, href: `/articles/category/${categorySlug}` }]

      : []),

    { name: post.title || '' },

  ]



  return (

    <>

      <ViewTracker postId={post.id} />

      <ArticleJsonLd
        author={authorProfile}
        description={post.excerpt}
        imageUrl={imageUrl}
        modifiedAt={modifiedAt}
        post={post}
        url={shareUrl}
      />

      <BreadcrumbJsonLd items={toBreadcrumbJsonLd(breadcrumbUi, siteUrl)} />

      <header id="">

        <AnimemiruHeader />

      </header>



      <div id="content-w">

        <div className="clearfix" id="content">

          <div id="contentInner">

            <main>

              <article>

                <div className="st-post post">

                  <PayloadRedirects disableNotFound url={url} />

                  {draft && <LivePreviewListener />}



                  <AnimemiruBreadcrumbs items={breadcrumbUi} />



                  {categoryTitle && categorySlug && (

                    <p className="st-catgroup">

                      <Link

                        href={`/articles/category/${categorySlug}`}

                        rel="category tag"

                        title={`View all posts in ${categoryTitle}`}

                      >

                        <span className="catname">{categoryTitle}</span>

                      </Link>

                    </p>

                  )}



                  <h1 className="entry-title">{post.title}</h1>



                  <div className="blogbox">

                    <p>

                      {post.publishedAt && (

                        <span className="kdate">

                          投稿日：

                          <time className="published" dateTime={post.publishedAt}>

                            {formatArticleDate(post.publishedAt)}

                          </time>

                        </span>

                      )}

                      {modifiedAt && modifiedAt !== post.publishedAt && (

                        <>

                          {' '}

                          <span className="kdate">

                            更新日：

                            <time className="updated" dateTime={modifiedAt}>

                              {formatArticleDate(modifiedAt)}

                            </time>

                          </span>

                        </>

                      )}

                    </p>

                  </div>



                  <SnsShare title={post.title} url={shareUrl} />



                  <ArticleSummary excerpt={post.excerpt} title={post.title} />



                  <div className="mainbox">

                    <div id="nocopy">

                      <div className="entry-content">

                        {post.contentHtml ? (

                          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

                        ) : (

                          <RichText data={post.content} enableGutter={false} />

                        )}

                      </div>

                    </div>

                  </div>



                  <SnsShare className="sns st-sns-bottom" title={post.title} url={shareUrl} />



                  <RelatedPosts posts={relatedPosts} />



                  <AuthorBox author={authorProfile} />

                  <p className="author">
                    執筆者:
                    <Link
                      href={`/articles/author/${authorProfile.slug}`}
                      title={authorProfile.name}
                    >
                      <span className="fn">{authorProfile.name}</span>
                    </Link>
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



export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {

  const { slug = '' } = await paramsPromise

  const post = await queryPost(decodeURIComponent(slug))

  return generateMeta({ doc: post })

}



const queryPost = cache(async (identifier: string): Promise<Post | null> => {

  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })



  const wpId = Number(identifier)

  const where: Where = Number.isFinite(wpId)

    ? {

        or: [{ wpId: { equals: wpId } }, { slug: { equals: identifier } }],

      }

    : { slug: { equals: identifier } }



  const result = await payload.find({

    collection: 'posts',

    draft,

    depth: 2,

    limit: 1,

    overrideAccess: draft,

    pagination: false,

    where,

  })



  return result.docs?.[0] ?? null

})

