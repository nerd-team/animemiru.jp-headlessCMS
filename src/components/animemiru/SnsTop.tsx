import { getServerSideURL } from '@/utilities/getURL'

import { SnsShare } from '@/components/animemiru/SnsShare'

export function SnsTop() {
  const siteUrl = getServerSideURL()

  return <SnsShare title="アニメミル" url={siteUrl} />
}
