/** Google AdSense（現行 animemiru.jp と同じ設定） */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''

/** サイドバー用レスポンシブ広告 */
export const ADSENSE_SIDEBAR_SLOT =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT || '1769183376'

/** 記事一覧インフィード広告 */
export const ADSENSE_INFEED_SLOT =
  process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT || '8297935880'

export const ADSENSE_INFEED_LAYOUT_KEY =
  process.env.NEXT_PUBLIC_ADSENSE_INFEED_LAYOUT_KEY || '-hd+t-25-dm+wq'

/** 記事詳細：本文下のディスプレイ広告（本番WPは2枠） */
export const ADSENSE_ARTICLE_SLOT_1 =
  process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT_1 || '2477922556'

export const ADSENSE_ARTICLE_SLOT_2 =
  process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT_2 || '2737228266'

/** 記事本文内の見出し前広告の上限（2・4・6番目の h2 手前に配置） */
export const ADSENSE_ARTICLE_INLINE_MAX = Number(
  process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_INLINE_MAX || 3,
)

/** 何記事ごとにインフィード広告を挿入するか（本番WPは3記事ごと） */
export const ADSENSE_INFEED_INTERVAL = Number(
  process.env.NEXT_PUBLIC_ADSENSE_INFEED_INTERVAL || 3,
)

export function isAdSenseEnabled() {
  return Boolean(ADSENSE_CLIENT)
}
