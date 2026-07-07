/**
 * 画像URLを同一オリジン相対パスに揃える。
 * animemiru.jp/wp-content/... は /wp-content/... にして nginx プロキシ経由で配信する。
 */
export function normalizeMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null

  const trimmed = url.trim()
  if (!trimmed) return null

  if (trimmed.startsWith('/')) return trimmed

  if (trimmed.startsWith('//')) {
    try {
      const parsed = new URL(`https:${trimmed}`)
      return parsed.pathname + parsed.search
    } catch {
      return trimmed
    }
  }

  try {
    const parsed = new URL(trimmed)
    if (parsed.hostname === 'animemiru.jp' || parsed.hostname === 'www.animemiru.jp') {
      return parsed.pathname + parsed.search
    }
  } catch {
    return trimmed
  }

  return trimmed
}

export function bestImageFromContent(html?: string | null): string | null {
  if (!html) return null

  const sources = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((match) => match[1])

  const preferred = sources
    .map((src) => normalizeMediaUrl(src))
    .filter((src): src is string => Boolean(src))
    .find(
      (src) =>
        src.includes('/wp-content/uploads/') &&
        (src.includes('eye-catch') || src.includes('featured') || src.includes('-catch')),
    )

  if (preferred) return preferred

  const upload = sources
    .map((src) => normalizeMediaUrl(src))
    .find((src) => src?.includes('/wp-content/uploads/'))

  if (upload) return upload

  return normalizeMediaUrl(sources[0])
}
