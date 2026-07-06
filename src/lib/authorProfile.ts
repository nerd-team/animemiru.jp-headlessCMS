import type { Media, Post, User } from '@/payload-types'

import { getServerSideURL } from '@/utilities/getURL'

export type AuthorProfile = {
  slug: string
  name: string
  description: string
  imageUrl: string
  sameAs: string[]
  jobTitle: string
}

export const DEFAULT_AUTHOR_SLUG = 'editor'

export const DEFAULT_AUTHOR_PROFILE: AuthorProfile = {
  slug: DEFAULT_AUTHOR_SLUG,
  name: 'animemiru編集部',
  description:
    'アニメミル編集部。アニメ好きのためのアニメ好きによるエンタメマガジンをお届けします。キャラクターランキング・考察・ネタバレ解説などを執筆しています。',
  imageUrl: '/theme/images/no-img.png',
  jobTitle: '編集者',
  sameAs: [
    'https://twitter.com/animemiru_media',
    'https://www.youtube.com/channel/UCCGMUAzlpKk9LyJxv7dUSWQ',
    'https://www.instagram.com/animemiru/',
    'https://facebook.com/animemiru',
  ],
}

type UserLike = {
  authorSlug?: string | null
  description?: string | null
  displayName?: string | null
  facebook?: string | null
  homepage?: string | null
  instagram?: string | null
  jobTitle?: string | null
  name?: string | null
  profileImage?: Media | string | null
  twitter?: string | null
}

function mediaUrl(media?: Media | string | null): string | undefined {
  if (!media || typeof media === 'string') return undefined
  const url = media.url
  if (!url) return undefined
  return url.startsWith('http') ? url : `${getServerSideURL()}${url}`
}

function buildSameAs(user: UserLike): string[] {
  const links = [user.twitter, user.facebook, user.instagram, user.homepage].filter(
    (url): url is string => Boolean(url?.trim()),
  )
  return links.length > 0 ? links : DEFAULT_AUTHOR_PROFILE.sameAs
}

export function userToAuthorProfile(user: UserLike): AuthorProfile {
  return {
    slug: user.authorSlug || DEFAULT_AUTHOR_SLUG,
    name: user.displayName || user.name || DEFAULT_AUTHOR_PROFILE.name,
    description: user.description || DEFAULT_AUTHOR_PROFILE.description,
    imageUrl: mediaUrl(user.profileImage) || DEFAULT_AUTHOR_PROFILE.imageUrl,
    jobTitle: user.jobTitle || DEFAULT_AUTHOR_PROFILE.jobTitle,
    sameAs: buildSameAs(user),
  }
}

export type PopulatedAuthor = NonNullable<Post['populatedAuthors']>[number]

export function populatedAuthorToProfile(author: PopulatedAuthor): AuthorProfile {
  const sameAs = author.sameAs?.filter(Boolean) as string[] | undefined
  return {
    slug: author.slug || DEFAULT_AUTHOR_SLUG,
    name: author.name || DEFAULT_AUTHOR_PROFILE.name,
    description: author.description || DEFAULT_AUTHOR_PROFILE.description,
    imageUrl: author.imageUrl || DEFAULT_AUTHOR_PROFILE.imageUrl,
    jobTitle: author.jobTitle || DEFAULT_AUTHOR_PROFILE.jobTitle,
    sameAs: sameAs?.length ? sameAs : DEFAULT_AUTHOR_PROFILE.sameAs,
  }
}

export function getAuthorProfileFromPost(post: Post): AuthorProfile {
  const populated = post.populatedAuthors?.[0]
  if (populated) return populatedAuthorToProfile(populated)
  return DEFAULT_AUTHOR_PROFILE
}
