type Banner = {
  alt?: string
  href: string
  imageUrl: string
}

import { SidebarAdUnit } from '@/components/animemiru/AdSenseUnit'

export { YouTubeShortsWidget } from '@/components/animemiru/YouTubeShortsWidget'

const SIDEBAR_BANNERS: Banner[] = [
  {
    href: 'https://maqe.website/?utm_source=animemiru&utm_medium=banner&utm_campaign=muryokaiinn',
    imageUrl: 'https://animemiru.jp/wp-content/uploads/2025/03/banner-1.png',
    alt: 'MAQE',
  },
  {
    href: 'https://seisaku-daikou.maqe.site/?utm_source=animemiru&utm_medium=banner&utm_campaign=seisaku-daiko',
    imageUrl: 'https://animemiru.jp/wp-content/uploads/2025/03/1114MAQE02.jpg',
    alt: '制作代行',
  },
]

export function SidebarBanners() {
  return (
    <>
      {SIDEBAR_BANNERS.map((banner) => (
        <div className="ad" key={banner.href}>
          <figure className="wp-block-image size-full">
            <a href={banner.href} rel="nofollow noopener noreferrer" target="_blank">
              <img
                alt={banner.alt || ''}
                className="sidebar-banner"
                decoding="async"
                loading="lazy"
                src={banner.imageUrl}
              />
            </a>
          </figure>
        </div>
      ))}
    </>
  )
}

export function SidebarAdSlot() {
  return <SidebarAdUnit />
}
