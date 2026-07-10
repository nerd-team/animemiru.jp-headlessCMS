/** img タグに alt がなければ付与し、lazy load を追加 */
export function enrichContentHtml(html: string, defaultAlt: string): string {
  const safeAlt = defaultAlt.replace(/"/g, '&quot;').slice(0, 120)

  let result = html
    // 過去バージョンが `<img ... / loading="lazy">` と壊していたものを修復
    .replace(/\s\/\s+loading=(["'])lazy\1/gi, ' loading=$1lazy$1')
    .replace(
      /(<img\b[^>]*?\ssrc=["'])(https?:\/\/(?:www\.)?animemiru\.jp)(\/wp-content\/[^"']+)(["'])/gi,
      '$1$3$4',
    )

  return result.replace(/<img\b([^>]*?)\s*\/?>/gi, (_match, attrs: string) => {
    let next = attrs.trim()
    if (!/alt=["'][^"']*["']/i.test(next)) {
      next += ` alt="${safeAlt}"`
    }
    if (!/loading=/i.test(next)) {
      next += ' loading="lazy"'
    }
    return `<img ${next}>`
  })
}
