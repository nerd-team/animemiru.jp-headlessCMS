/** HTMLタグを除去してプレーンテキストにする */
function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, '').trim()
}

/** 一覧・スライダー用の短い抜粋（80文字前後で「……」） */
export function truncateExcerpt(text: string, maxLength = 80): string {
  const plain = stripHtml(text)
  if (!plain) return ''
  if (plain.length <= maxLength) return plain
  return `${plain.slice(0, maxLength)}……`
}

/** ランキング等の短いタイトル（40文字前後で「……」） */
export function truncateTitle(text: string, maxLength = 40): string {
  const plain = stripHtml(text)
  if (!plain) return ''
  if (plain.length <= maxLength) return plain
  return `${plain.slice(0, maxLength)}……`
}
