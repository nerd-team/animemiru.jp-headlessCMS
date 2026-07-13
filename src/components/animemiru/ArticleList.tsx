import type { Post } from '@/payload-types'
import Link from 'next/link'
import { Fragment } from 'react'

import { InFeedAdUnit } from '@/components/animemiru/AdSenseUnit'
import { ADSENSE_INFEED_INTERVAL } from '@/lib/adsenseConfig'
import { formatDateTime } from '@/utilities/formatDateTime'
import { getPostHref } from '@/utilities/getPostHref'
import { getCategoryHref } from '@/utilities/categorySlug'
import { getPostImageUrl } from '@/utilities/getPostImageUrl'
import { truncateExcerpt } from '@/utilities/truncateExcerpt'

type Props = {
  posts: Post[]
  showInFeedAds?: boolean
}

function getThumbUrl(post: Post) {
  return getPostImageUrl(post)
}

export function ArticleList({ posts, showInFeedAds = false }: Props) {
  return (
    <div className="kanren">
      {posts.map((post, index) => {
        const category = post.categories?.[0]
        const categoryTitle =
          typeof category === 'object' && category !== null ? category.title : null
        const categorySlug =
          typeof category === 'object' && category !== null ? category.slug : null
        const href = getPostHref(post)
        const insertInFeedAd =
          showInFeedAds &&
          ADSENSE_INFEED_INTERVAL > 0 &&
          (index + 1) % ADSENSE_INFEED_INTERVAL === 0

        return (
          <Fragment key={post.id}>
            <dl className="clearfix">
              <dt>
                <Link href={href}>
                  <img
                    alt={post.title}
                    height={100}
                    src={getThumbUrl(post)}
                    title={post.title}
                    width={100}
                  />
                </Link>
              </dt>
              <dd>
                {categoryTitle && categorySlug && (
                  <p className="st-catgroup itiran-category">
                    <Link href={getCategoryHref(categorySlug)} rel="category tag">
                      <span className="catname">{categoryTitle}</span>
                    </Link>
                  </p>
                )}
                <h3>
                  <Link href={href}>{post.title}</Link>
                </h3>
                {post.publishedAt && (
                  <p className="blog_info">
                    <i className="fa fa-clock-o" />
                    <time dateTime={post.publishedAt}>{formatDateTime(post.publishedAt)}</time>
                  </p>
                )}
                {post.excerpt && (
                  <div className="smanone st-excerpt">{truncateExcerpt(post.excerpt)}</div>
                )}
              </dd>
            </dl>
            {insertInFeedAd ? <InFeedAdUnit /> : null}
          </Fragment>
        )
      })}
    </div>
  )
}
