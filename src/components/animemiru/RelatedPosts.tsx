import type { Post } from '@/payload-types'
import Link from 'next/link'
import { Fragment } from 'react'

import { ADSENSE_INFEED_INTERVAL, InFeedAdUnit } from '@/components/animemiru/AdSenseUnit'
import { isAdSenseEnabled } from '@/lib/adsenseConfig'
import { formatDateTime } from '@/utilities/formatDateTime'
import { getPostHref } from '@/utilities/getPostHref'
import { getCategoryHref } from '@/utilities/categorySlug'
import { getPostImageUrl } from '@/utilities/getPostImageUrl'

type Props = {
  posts: Post[]
  title?: string
}

export function RelatedPosts({ posts, title = '関連記事' }: Props) {
  if (posts.length === 0) return null

  const showInFeedAds = isAdSenseEnabled()

  return (
    <div className="kanren pop-box">
      <p className="p-entry-t">
        <span className="p-entry">{title}</span>
      </p>
      {posts.map((post, index) => {
        const href = getPostHref(post)
        const category = post.categories?.[0]
        const categoryTitle =
          typeof category === 'object' && category !== null ? category.title : null
        const categorySlug =
          typeof category === 'object' && category !== null ? category.slug : null
        const insertInFeedAd =
          showInFeedAds &&
          ADSENSE_INFEED_INTERVAL > 0 &&
          (index + 1) % ADSENSE_INFEED_INTERVAL === 0

        return (
          <Fragment key={post.id}>
            <dl className="clearfix">
              <dt className="poprank">
                <Link href={href}>
                  <img
                    alt={post.title}
                    height={160}
                    src={getPostImageUrl(post)}
                    title={post.title}
                    width={160}
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
                <h5 className="kanren-t">
                  <Link href={href}>{post.title}</Link>
                </h5>
                {post.publishedAt && (
                  <p className="blog_info">
                    <i className="fa fa-clock-o" />
                    <time dateTime={post.publishedAt}>{formatDateTime(post.publishedAt)}</time>
                  </p>
                )}
              </dd>
            </dl>
            {insertInFeedAd && <InFeedAdUnit />}
          </Fragment>
        )
      })}
    </div>
  )
}
