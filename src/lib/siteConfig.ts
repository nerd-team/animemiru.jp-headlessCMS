export const SITE_NAME = 'アニメミル'
export const SITE_TAGLINE = 'アニメ好きのエンタメマガジン'
export const SITE_DESCRIPTION =
  'アニメ好きのためのエンタメマガジン。キャラクターランキング・考察・ネタバレ解説など。'

export const DEFAULT_OG_IMAGE =
  process.env.NEXT_PUBLIC_OG_IMAGE || 'https://animemiru.jp/wp-content/img/ogp_top.jpg'

export const TWITTER_SITE = '@animemiru_media'

export const ORGANIZATION = {
  name: SITE_NAME,
  url: 'https://animemiru.jp',
  logo: DEFAULT_OG_IMAGE,
  sameAs: [
    'https://twitter.com/animemiru_media',
    'https://www.youtube.com/channel/UCCGMUAzlpKk9LyJxv7dUSWQ',
    'https://www.instagram.com/animemiru/',
    'https://facebook.com/animemiru',
    'https://www.nicovideo.jp/user/animemiru',
  ],
} as const
