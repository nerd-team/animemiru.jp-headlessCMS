import type { AuthorProfile } from '@/lib/authorProfile'
import { DEFAULT_AUTHOR_PROFILE } from '@/lib/authorProfile'
import { ORGANIZATION, SITE_DESCRIPTION } from '@/lib/siteConfig'
import type { Post } from '@/payload-types'

import { getServerSideURL } from '@/utilities/getURL'

type BreadcrumbItem = {
  name: string
  url?: string
}

type ArticleJsonLdProps = {
  author?: AuthorProfile
  description?: string | null
  imageUrl?: string
  modifiedAt?: string | null
  post: Pick<Post, 'title' | 'publishedAt' | 'wpId' | 'slug'>
  url: string
}

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  )
}

export function ArticleJsonLd({
  author,
  description,
  imageUrl,
  modifiedAt,
  post,
  url,
}: ArticleJsonLdProps) {
  const authorProfile = author || DEFAULT_AUTHOR_PROFILE
  const authorUrl = `${getServerSideURL()}/articles/author/${authorProfile.slug}`

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: description || undefined,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: modifiedAt || post.publishedAt || undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Person',
      name: authorProfile.name,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      logo: {
        '@type': 'ImageObject',
        url: ORGANIZATION.logo,
      },
    },
  }

  return <JsonLdScript data={data} />
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <JsonLdScript data={data} />
}

export function WebSiteJsonLd({ url }: { url: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORGANIZATION.name,
    url,
    description: SITE_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?s={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return <JsonLdScript data={data} />
}

export function OrganizationJsonLd() {
  const siteUrl = getServerSideURL()
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION.name,
    url: siteUrl,
    logo: ORGANIZATION.logo,
    description: SITE_DESCRIPTION,
    sameAs: ORGANIZATION.sameAs,
  }

  return <JsonLdScript data={data} />
}

export function PersonJsonLd({ author, url }: { author: AuthorProfile; url: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url,
    image: author.imageUrl.startsWith('http')
      ? author.imageUrl
      : `${getServerSideURL()}${author.imageUrl}`,
    description: author.description,
    jobTitle: author.jobTitle,
    worksFor: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      url: getServerSideURL(),
    },
    sameAs: author.sameAs,
  }

  return <JsonLdScript data={data} />
}

export function CollectionPageJsonLd({
  description,
  name,
  url,
}: {
  description: string
  name: string
  url: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: ORGANIZATION.name,
      url: getServerSideURL(),
    },
  }

  return <JsonLdScript data={data} />
}
