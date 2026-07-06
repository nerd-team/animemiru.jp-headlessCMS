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

  return [internetExplorerRedirect, legacyPostRedirect]
}
