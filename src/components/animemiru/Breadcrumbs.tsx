import Link from 'next/link'

export type BreadcrumbItem = {
  href?: string
  name: string
}

type Props = {
  items: BreadcrumbItem[]
}

export function AnimemiruBreadcrumbs({ items }: Props) {
  return (
    <div id="breadcrumb">
      <ol itemScope itemType="http://schema.org/BreadcrumbList">
        {items.map((item, index) => (
          <li
            itemProp="itemListElement"
            itemScope
            itemType="http://schema.org/ListItem"
            key={`${item.name}-${index}`}
          >
            {item.href ? (
              <Link href={item.href} itemProp="item">
                <span itemProp="name">{item.name}</span>
              </Link>
            ) : (
              <span itemProp="name">{item.name}</span>
            )}
            {index < items.length - 1 && <> &gt;</>}
            <meta content={String(index + 1)} itemProp="position" />
          </li>
        ))}
      </ol>
    </div>
  )
}

/** BreadcrumbList JSON-LD 用 */
export function toBreadcrumbJsonLd(items: BreadcrumbItem[], siteUrl: string) {
  return items.map((item) => ({
    name: item.name,
    url: item.href ? (item.href.startsWith('http') ? item.href : `${siteUrl}${item.href}`) : undefined,
  }))
}
