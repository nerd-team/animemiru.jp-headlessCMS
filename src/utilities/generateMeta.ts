import type { Metadata } from 'next'

import { DEFAULT_OG_IMAGE, SITE_NAME, TWITTER_SITE } from '@/lib/siteConfig'
import type { Media, Page, Post } from '@/payload-types'

import { getPostCanonicalUrl } from './getPostCanonicalUrl'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | string | null, fallback?: string) => {
  const serverUrl = getServerSideURL()

  if (typeof image === 'object' && image !== null && 'url' in image && image.url) {
    const ogUrl = image.sizes?.og?.url || image.url
    return ogUrl.startsWith('http') ? ogUrl : `${serverUrl}${ogUrl}`
  }

  return fallback || DEFAULT_OG_IMAGE
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args
  const post = doc as Partial<Post> | null

  const pageTitle = doc?.meta?.title || doc?.title || SITE_NAME
  const title = pageTitle === SITE_NAME ? pageTitle : `${pageTitle} | ${SITE_NAME}`
  const description = doc?.meta?.description || post?.excerpt || undefined

  const isPost = Boolean(post?.wpId != null || post?.contentHtml)
  const url = isPost && post?.slug
    ? getPostCanonicalUrl(post as Pick<Post, 'slug' | 'wpId'>)
    : doc?.slug
      ? `${getServerSideURL()}${doc.slug === 'home' ? '' : `/${doc.slug}`}`
      : getServerSideURL()

  const ogImage = getImageURL(
    typeof doc?.meta?.image === 'object' ? doc.meta.image : null,
    isPost && typeof post?.heroImage === 'object' && post.heroImage
      ? getImageURL(post.heroImage as Media)
      : DEFAULT_OG_IMAGE,
  )

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: mergeOpenGraph({
      type: isPost ? 'article' : 'website',
      description: description || '',
      images: [{ url: ogImage, alt: pageTitle }],
      title,
      url,
    }),
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_SITE,
      title,
      description: description || undefined,
      images: [ogImage],
    },
  }
}
