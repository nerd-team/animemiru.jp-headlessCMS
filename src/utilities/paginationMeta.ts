import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export function parsePageParam(pageParam?: string): number {
  return Math.max(1, Number(pageParam) || 1)
}

export function buildPaginatedUrl(basePath: string, page: number, query?: string): string {
  const params = new URLSearchParams()
  if (query) params.set('s', query)
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

/** 2ページ目以降は noindex + 自己参照 canonical */
export function buildPaginatedMetadata({
  basePath,
  description,
  openGraphTitle,
  page,
  query,
  siteUrl,
  title,
}: {
  basePath: string
  description?: string
  openGraphTitle?: string
  page: number
  query?: string
  siteUrl: string
  title: string
}): Metadata {
  const path = buildPaginatedUrl(basePath, page, query)
  const canonical = `${siteUrl}${path}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: mergeOpenGraph({
      title: openGraphTitle || title,
      description: description || '',
      url: canonical,
    }),
    robots: page > 1 ? { index: false, follow: true } : undefined,
  }
}
