/** WordPress 由来のカテゴリ slug を正規化（DB保存・URL用） */
export function normalizeCategorySlug(slug: string): string {
  const trimmed = slug.trim()
  if (!trimmed) return ''

  try {
    return decodeURIComponent(trimmed)
  } catch {
    return trimmed
  }
}

/** ルックアップ用にエンコード済み・デコード済みの候補を返す */
export function categorySlugLookupValues(slugParam: string): string[] {
  const values = new Set<string>()
  const add = (value: string) => {
    const trimmed = value.trim()
    if (trimmed) values.add(trimmed)
  }

  add(slugParam)

  try {
    add(decodeURIComponent(slugParam))
  } catch {
    // noop
  }

  const normalized = normalizeCategorySlug(slugParam)
  add(normalized)

  try {
    add(encodeURIComponent(normalized))
  } catch {
    // noop
  }

  return [...values]
}

export function getCategoryHref(slug: string): string {
  const normalized = normalizeCategorySlug(slug)
  return `/articles/category/${encodeURIComponent(normalized)}`
}
