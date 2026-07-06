import type { Post } from '@/payload-types'
import Link from 'next/link'
import { formatDateTime } from '@/utilities/formatDateTime'
import { getPostHref } from '@/utilities/getPostHref'
import { getPostImageUrl } from '@/utilities/getPostImageUrl'
import { truncateExcerpt } from '@/utilities/truncateExcerpt'

type Props = {
  posts: Post[]
}

function getThumbUrl(post: Post) {
  return getPostImageUrl(post)
}

export function ArticleList({ posts }: Props) {
  return (
    <div className="kanren">
      {posts.map((post) => {
        const category = post.categories?.[0]
        const categoryTitle =
          typeof category === 'object' && category !== null ? category.title : null
        const categorySlug =
          typeof category === 'object' && category !== null ? category.slug : null
        const href = getPostHref(post)

        return (
          <dl className="clearfix" key={post.id}>
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
                  <Link href={`/articles/category/${categorySlug}`} rel="category tag">
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
        )
      })}
    </div>
  )
}
