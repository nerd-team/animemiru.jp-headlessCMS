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

  const pageHref = (p: number) => {
    const params = new URLSearchParams()
    if (query) params.set('s', query)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    const path = basePath.split('?')[0]
    return qs ? `${path}?${qs}` : path
  }

  return (
    <div className="st-pagelink">
      <div className="st-pagelink-in">
        {hasPrevPage && (
          <Link className="previouspostslink" href={pageHref(page - 1)}>
            &laquo; 前へ
          </Link>
        )}
        <span aria-current="page" className="page-numbers current">
          {page}
        </span>
        {Array.from({ length: Math.min(3, totalPages - page) }, (_, i) => page + i + 1).map(
          (p) => (
            <Link className="page-numbers" href={pageHref(p)} key={p}>
              {p}
            </Link>
          ),
        )}
        {page + 3 < totalPages && <span className="page-numbers dots">&hellip;</span>}
        {totalPages > page + 3 && (
          <Link className="page-numbers" href={pageHref(totalPages)}>
            {totalPages}
          </Link>
        )}
        {hasNextPage && (
          <Link className="nextpostslink" href={pageHref(page + 1)}>
            次へ &raquo;
          </Link>
        )}
      </div>
    </div>
  )
}
