/** img タグに alt がなければ付与し、lazy load を追加 */
export function enrichContentHtml(html: string, defaultAlt: string): string {
  const safeAlt = defaultAlt.replace(/"/g, '&quot;').slice(0, 120)

  return html.replace(/<img([^>]*?)>/gi, (match, attrs) => {
    let next = attrs
    if (!/alt=["'][^"']*["']/i.test(next)) {
      next += ` alt="${safeAlt}"`
    }
    if (!/loading=/i.test(next)) {
      next += ' loading="lazy"'
    }
    return `<img${next}>`
  })
}
