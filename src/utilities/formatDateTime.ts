export const formatDateTime = (timestamp: string): string => {
  const date = timestamp ? new Date(timestamp) : new Date()
  const MM = date.getUTCMonth() + 1
  const DD = date.getUTCDate()
  const YYYY = date.getUTCFullYear()

  return `${MM}/${DD}/${YYYY}`
}

export const formatArticleDate = (timestamp: string): string => {
  const date = new Date(timestamp)
  const YYYY = date.getUTCFullYear()
  const MM = String(date.getUTCMonth() + 1).padStart(2, '0')
  const DD = String(date.getUTCDate()).padStart(2, '0')
  return `${YYYY}-${MM}-${DD}`
}
