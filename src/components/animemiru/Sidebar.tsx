import Link from 'next/link'
import type { Post } from '@/payload-types'

import { SidebarAdSlot, SidebarBanners } from '@/components/animemiru/SidebarWidgets'
import { getPostHref } from '@/utilities/getPostHref'
import { getPostImageUrl } from '@/utilities/getPostImageUrl'
import { truncateTitle } from '@/utilities/truncateExcerpt'

type Props = {
  popularPosts?: Post[]
}

export function AnimemiruSidebar({ popularPosts = [] }: Props) {
  return (
    <div id="side">
      <aside>
        <div className="side-topad">
          <SidebarBanners />

          <div className="ad">
            <p className="st-widgets-title">
              <span>気になるアニメのキーワードを検索</span>
            </p>
            <div id="search">
              <form action="/search" id="searchform" method="get">
                <label className="hidden" htmlFor="s">
                  {' '}
                </label>
                <input id="s" name="s" placeholder="検索するテキストを入力" type="text" />
                <input alt="検索" id="searchsubmit" src="/theme/images/search.png" type="image" />
              </form>
            </div>
          </div>

          {popularPosts.length > 0 && (
            <div className="ad">
              <div className="widget popular-posts">
                <p className="st-widgets-title">
                  <span>アクセスランキング</span>
                </p>
                <ul className="wpp-list">
                  {popularPosts.map((post) => {
                    const href = getPostHref(post)
                    const thumbUrl = getPostImageUrl(post)

                    return (
                      <li key={post.id}>
                        <span className="wpp-meta post-stats" />
                        <div className="wpp-item-thumb">
                          <Link href={href}>
                            <img
                              alt=""
                              className="wpp-thumbnail wpp_featured"
                              decoding="async"
                              height={100}
                              src={thumbUrl}
                              width={100}
                            />
                          </Link>
                        </div>
                        <div className="wpp-item-body">
                          <Link className="wpp-post-title" href={href} title={post.title || undefined}>
                            {truncateTitle(post.title || '')}
                          </Link>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}

          <SidebarAdSlot />
        </div>
      </aside>
    </div>
  )
}
