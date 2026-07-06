export const SITE_NAME = 'アニメミル'
export const SITE_TAGLINE = 'アニメ好きのエンタメマガジン'
export const SITE_DESCRIPTION =
  'アニメ好きのためのエンタメマガジン。キャラクターランキング・考察・ネタバレ解説など。'

export const DEFAULT_OG_IMAGE =
  process.env.NEXT_PUBLIC_OG_IMAGE || 'https://animemiru.jp/wp-content/img/ogp_top.jpg'

/** schema.org Organization.logo 用（正方形推奨） */
export const ORGANIZATION_LOGO =
  process.env.NEXT_PUBLIC_ORG_LOGO ||
  'https://animemiru.jp/wp-content/uploads/2019/03/favicon-32×32-v2.png'

export const TWITTER_SITE = '@animemiru_media'

/** Google Analytics 4（現行 animemiru.jp と同じ G-4CP0HT6FZX） */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-4CP0HT6FZX'

export const ORGANIZATION = {
  name: SITE_NAME,
  url: 'https://animemiru.jp',
  logo: ORGANIZATION_LOGO,
  sameAs: [
    'https://twitter.com/animemiru_media',
    'https://www.youtube.com/@-animemiru2785/shorts',
    'https://www.instagram.com/animemiru/',
    'https://facebook.com/animemiru',
  ],
} as const
