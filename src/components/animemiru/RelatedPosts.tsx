import type { Post } from '@/payload-types'
import Link from 'next/link'

import { formatDateTime } from '@/utilities/formatDateTime'
import { getPostHref } from '@/utilities/getPostHref'
import { getPostImageUrl } from '@/utilities/getPostImageUrl'

type Props = {
  posts: Post[]
  title?: string
}

export function RelatedPosts({ posts, title = '関連記事' }: Props) {
  if (posts.length === 0) return null

  return (
    <div className="kanren pop-box">
      <p className="p-entry-t">
        <span className="p-entry">{title}</span>
      </p>
      {posts.map((post) => {
        const href = getPostHref(post)
        const category = post.categories?.[0]
        const categoryTitle =
          typeof category === 'object' && category !== null ? category.title : null
        const categorySlug =
          typeof category === 'object' && category !== null ? category.slug : null

        return (
          <dl className="clearfix" key={post.id}>
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
                  <Link href={`/articles/category/${categorySlug}`} rel="category tag">
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
        )
      })}
    </div>
  )
}
