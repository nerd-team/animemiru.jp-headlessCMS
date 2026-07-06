type PostLike = {
  title?: string | null
  excerpt?: string | null
}

/** 記事タイトルから【作品名】を抽出 */
export function extractWorkTitle(title: string): string | null {
  const match = title.match(/【([^】]+)】/)
  return match?.[1] ?? null
}

/** ランキング記事かどうか */
export function isRankingArticle(title?: string | null): boolean {
  return Boolean(title?.includes('ランキング'))
}

/** 「この記事でわかること」用の3行リスト */
export function generateArticleSummary(post: PostLike): string[] {
  const title = post.title || ''
  const excerpt = post.excerpt?.trim() || ''
  const work = extractWorkTitle(title)

  if (isRankingArticle(title) && work) {
    return [
      `『${work}』登場キャラクターの人気ランキング`,
      '各キャラクターの魅力・人気ポイント',
      '順位と注目の理由を解説',
    ]
  }

  if (excerpt) {
    const parts = excerpt
      .split(/[。．]/u)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3)

    if (parts.length >= 2) {
      return parts.map((s) => (s.endsWith('。') ? s : `${s}。`))
    }
    if (parts.length === 1) {
      return [parts[0].endsWith('。') ? parts[0] : `${parts[0]}。`]
    }
  }

  if (work) {
    return [`『${work}』に関する記事内容を解説`, 'キャラクター・ストーリーのポイント', 'ファン必見の情報をまとめて紹介']
  }

  return title ? [`${title}について解説`] : []
}

/** カテゴリのデフォルト説明文 */
export function getCategoryDescription(title: string, custom?: string | null): string {
  if (custom?.trim()) return custom.trim()
  return `『${title}』に関する記事一覧。キャラクターランキング・考察・ネタバレ解説など、アニメミルがお届けするエンタメ情報を掲載しています。`
}
