import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)',
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)',
  }

  const legacyPostRedirect = {
    source: '/posts/:path*',
    destination: '/articles/:path*',
    permanent: true,
  }

  const legacyFeedRedirects = [
    { source: '/feed', destination: '/feed.xml', permanent: true },
    { source: '/feed/', destination: '/feed.xml', permanent: true },
  ]

  const legacyHomePaginationRedirects = [
    { source: '/page/:page', destination: '/?page=:page', permanent: true },
    { source: '/page/:page/', destination: '/?page=:page', permanent: true },
  ]

  return [
    internetExplorerRedirect,
    legacyPostRedirect,
    ...legacyFeedRedirects,
    ...legacyHomePaginationRedirects,
  ]
}
