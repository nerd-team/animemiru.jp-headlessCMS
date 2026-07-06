import type { Metadata } from 'next'

import { SITE_NAME } from '@/lib/siteConfig'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

export function generateStaticPageMeta(
  title: string,
  path: string,
  description?: string,
): Metadata {
  const url = `${getServerSideURL()}${path}`
  const fullTitle = `${title} | ${SITE_NAME}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: mergeOpenGraph({
      title: fullTitle,
      description: description || '',
      url,
    }),
  }
}
