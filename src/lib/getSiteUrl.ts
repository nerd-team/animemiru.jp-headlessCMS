import { getServerSideURL } from '@/utilities/getURL'

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    getServerSideURL()
  )
}
