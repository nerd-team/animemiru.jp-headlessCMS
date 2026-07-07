export type ArticleContentSegment =
  | { type: 'html'; html: string }
  | { type: 'ad'; slotIndex: number }

/**
 * 記事本文を h2 手前で分割し、見出し前広告を最大 maxInlineAds 個まで挿入する。
 * 2番目・4番目・6番目の h2 手前に配置（旧 AFFINGER の見出し前広告相当）。
 */
export function splitArticleContentForAds(
  html: string,
  maxInlineAds: number,
): ArticleContentSegment[] {
  if (!html || maxInlineAds <= 0) {
    return [{ type: 'html', html }]
  }

  const segments: ArticleContentSegment[] = []
  const h2Regex = /<h2\b[^>]*>/gi
  const matches: { index: number }[] = []

  let match: RegExpExecArray | null
  while ((match = h2Regex.exec(html)) !== null) {
    matches.push({ index: match.index })
  }

  if (matches.length === 0) {
    return [{ type: 'html', html }]
  }

  let h2Index = 0
  let adsInserted = 0
  let lastIndex = 0

  for (const { index } of matches) {
    h2Index++
    const shouldInsert =
      adsInserted < maxInlineAds && h2Index >= 2 && (h2Index - 2) % 2 === 0

    if (shouldInsert) {
      segments.push({ type: 'html', html: html.slice(lastIndex, index) })
      segments.push({ type: 'ad', slotIndex: adsInserted })
      adsInserted++
      lastIndex = index
    }
  }

  segments.push({ type: 'html', html: html.slice(lastIndex) })

  return segments.filter((segment) => segment.type !== 'html' || segment.html.length > 0)
}
