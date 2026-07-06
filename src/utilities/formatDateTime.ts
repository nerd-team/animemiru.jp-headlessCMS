export const formatDateTime = (timestamp: string): string => {
  const now = new Date()
  let date = now
  if (timestamp) date = new Date(timestamp)
  const months = date.getMonth()
  const days = date.getDate()

  const MM = months + 1
  const DD = days
  const YYYY = date.getFullYear()

  return `${MM}/${DD}/${YYYY}`
}

export const formatArticleDate = (timestamp: string): string => {
  const date = new Date(timestamp)
  const YYYY = date.getFullYear()
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const DD = String(date.getDate()).padStart(2, '0')
  return `${YYYY}-${MM}-${DD}`
}
