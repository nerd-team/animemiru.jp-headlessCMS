'use client'

import Link from 'next/link'

type Props = {
  basePath?: string
  page: number
  query?: string
  totalPages: number
}

export function Pagination({ basePath = '/', page, query, totalPages }: Props) {
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  if (totalPages <= 1) return null

  const pageHref = (p: number) => {
    const params = new URLSearchParams()
    if (query) params.set('s', query)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    const path = basePath.split('?')[0]
    return qs ? `${path}?${qs}` : path
  }

  const windowSize = Math.min(3, totalPages)
  const windowStart = Math.max(1, Math.min(page - 1, totalPages - windowSize + 1))
  const windowPages = Array.from({ length: windowSize }, (_, i) => windowStart + i).filter(
    (p) => p <= totalPages,
  )
  const windowEnd = windowPages[windowPages.length - 1] ?? page
  const showLeading = windowStart > 1
  const showLeadingDots = windowStart > 2
  const showTrailing = windowEnd < totalPages
  const showTrailingDots = windowEnd < totalPages - 1

  const renderPage = (p: number) =>
    p === page ? (
      <span aria-current="page" className="page-numbers current" key={p}>
        {p}
      </span>
    ) : (
      <Link className="page-numbers" href={pageHref(p)} key={p}>
        {p}
      </Link>
    )

  return (
    <nav aria-label="ページナビゲーション" className="st-pagelink">
      <p className="st-pagelink-summary">
        {page} / {totalPages} ページ
      </p>
      <div className="st-pagelink-in">
        {hasPrevPage && (
          <Link className="page-numbers previouspostslink" href={pageHref(page - 1)}>
            &laquo; 前へ
          </Link>
        )}
        {showLeading && renderPage(1)}
        {showLeadingDots && <span className="page-numbers dots">&hellip;</span>}
        {windowPages.map((p) => renderPage(p))}
        {showTrailingDots && <span className="page-numbers dots">&hellip;</span>}
        {showTrailing && renderPage(totalPages)}
        {hasNextPage && (
          <Link className="page-numbers nextpostslink" href={pageHref(page + 1)}>
            次へ &raquo;
          </Link>
        )}
      </div>
    </nav>
  )
}
