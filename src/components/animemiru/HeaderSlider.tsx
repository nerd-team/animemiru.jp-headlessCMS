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

export function HeaderSlider({ posts }: Props) {
  if (posts.length === 0) return null

  const slickOptions = JSON.stringify({
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    dots: false,
    autoplaySpeed: 5000,
    fade: true,
    rtl: false,
  })

  return (
    <div id="gazou-wide">
      <div id="st-headerbox">
        <div id="st-header">
          <div className="header-post-slider-container">
            <div
              className="slider post-slider header-post-slider has-excerpt is-fade has-cat has-date"
              data-slick={slickOptions}
            >
              {posts.map((post) => {
                const category = post.categories?.[0]
                const categoryTitle =
                  typeof category === 'object' && category !== null ? category.title : null
                const categorySlug =
                  typeof category === 'object' && category !== null ? category.slug : null
                const href = getPostHref(post)
                const thumbUrl = getThumbUrl(post)

                return (
                  <div className="slider-item post-slide has-image" key={post.id}>
                    <div className="post-slide-image">
                      <Link href={href}>
                        <img alt={post.title} height={1060} src={thumbUrl} title={post.title} width={1060} />
                      </Link>
                    </div>
                    <div className="post-slide-body">
                      <div className="post-slide-body-content">
                        <div className="post-slide-text">
                          {categoryTitle && categorySlug && (
                            <p className="st-catgroup itiran-category">
                              <Link href={`/articles/category/${categorySlug}`} rel="category tag">
                                <span className="catname">{categoryTitle}</span>
                              </Link>
                            </p>
                          )}
                          <p className="post-slide-title">
                            <Link href={href}>{post.title}</Link>
                          </p>
                          {post.publishedAt && (
                            <p className="post-slide-date">
                              <i className="fa fa-clock-o" />
                              {formatDateTime(post.publishedAt)}
                            </p>
                          )}
                          {post.excerpt && (
                            <div className="post-slide-excerpt st-excerpt">
                              {truncateExcerpt(post.excerpt)}
                            </div>
                          )}
                        </div>
                        <p className="post-slide-more">
                          <Link href={href}>ReadMore</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
