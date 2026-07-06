import type { Metadata } from 'next'
import React from 'react'

import { AnimemiruFooter } from '@/components/animemiru/Footer'
import { OrganizationJsonLd } from '@/components/animemiru/JsonLd'
import { ThemeScripts } from '@/components/animemiru/ThemeScripts'
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  TWITTER_SITE,
} from '@/lib/siteConfig'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/earlyaccess/notosansjp.css" rel="stylesheet" />
        <link href="/theme/css/normalize.css" rel="stylesheet" />
        <link href="/theme/css/theme-main.css" rel="stylesheet" />
        <link href="/theme/css/child.css" rel="stylesheet" />
        <link href="/theme/css/fontawesome/css/font-awesome.min.css" rel="stylesheet" />
        <link href="/theme/css/slick.css" rel="stylesheet" />
        <link href="/theme/css/slick-theme.css" rel="stylesheet" />
        <link href="/theme/css/lsi.css" rel="stylesheet" />
        <link href="/theme/css/custom.css" rel="stylesheet" />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link
          href="/feed.xml"
          rel="alternate"
          title="アニメミル RSS"
          type="application/rss+xml"
        />
      </head>
      <body className="home blog front-page">
        <OrganizationJsonLd />
        <div id="st-ami">
          <div id="wrapper">
            <div id="wrapper-in">
              {children}
              <AnimemiruFooter />
            </div>
          </div>
        </div>
        <ThemeScripts />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: `${SITE_TAGLINE} - ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: getServerSideURL(),
  },
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_SITE,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
}
