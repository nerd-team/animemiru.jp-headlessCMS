export function sanitizeHtml(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}
