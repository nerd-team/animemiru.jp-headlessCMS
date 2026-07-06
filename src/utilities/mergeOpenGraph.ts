import type { Metadata } from 'next'

import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/siteConfig'
import { getServerSideURL } from './getURL'

export const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  locale: 'ja_JP',
  description: SITE_DESCRIPTION,
  images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  siteName: SITE_NAME,
  title: `${SITE_TAGLINE} - ${SITE_NAME}`,
  url: getServerSideURL(),
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
