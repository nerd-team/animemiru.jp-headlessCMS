import Link from 'next/link'

import { PersonJsonLd } from '@/components/animemiru/JsonLd'
import {
  DEFAULT_AUTHOR_PROFILE,
  type AuthorProfile,
} from '@/lib/authorProfile'
import { getServerSideURL } from '@/utilities/getURL'

type Props = {
  author?: AuthorProfile | null
}

export function AuthorBox({ author }: Props) {
  const profile = author || DEFAULT_AUTHOR_PROFILE
  const authorUrl = `${getServerSideURL()}/articles/author/${profile.slug}`

  return (
    <>
      <PersonJsonLd author={profile} url={authorUrl} />
      <div className="st-author-box">
        <ul id="st-tab-menu">
          <li className="active">
            <i aria-hidden="true" className="fa fa-user st-css-no" />
            この記事を書いた人
          </li>
        </ul>
        <div className="clearfix" id="st-tab-box">
          <div className="active">
            <dl>
              <dt>
                <img
                  alt={profile.name}
                  className="avatar avatar-80 photo"
                  height={80}
                  src={profile.imageUrl}
                  width={80}
                />
              </dt>
              <dd>
                <p className="author-name">
                  <Link href={`/articles/author/${profile.slug}`}>{profile.name}</Link>
                </p>
                <p className="author-description">{profile.description}</p>
                {profile.sameAs.length > 0 && (
                  <ul className="author-sns">
                    {profile.sameAs.map((href) => (
                      <li key={href}>
                        <a href={href} rel="nofollow noopener noreferrer" target="_blank">
                          {snsLabel(href)}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}

function snsLabel(href: string): string {
  if (href.includes('twitter.com') || href.includes('x.com')) return 'Twitter'
  if (href.includes('youtube.com')) return 'YouTube'
  if (href.includes('instagram.com')) return 'Instagram'
  if (href.includes('facebook.com')) return 'Facebook'
  return 'SNS'
}
