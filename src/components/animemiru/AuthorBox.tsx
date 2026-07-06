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
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}
