import config from '@payload-config'
import { getPayload } from 'payload'

const WP_URL = process.env.WP_URL || 'https://animemiru.jp'

function extractRankingWpIds(html: string) {
  const sectionStart = html.indexOf('widget popular-posts')
  if (sectionStart === -1) return []

  const section = html.slice(sectionStart, sectionStart + 50000)
  const matches = [...section.matchAll(/\/articles\/(\d+)\//g)]
  const ids: number[] = []

  for (const match of matches) {
    const id = Number(match[1])
    if (!ids.includes(id)) ids.push(id)
  }

  return ids
}

export async function syncPopularRankingFromLive() {
  const res = await fetch(WP_URL, { signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`Failed to fetch ${WP_URL}`)

  const html = await res.text()
  const wpIds = extractRankingWpIds(html)
  if (wpIds.length === 0) {
    return { message: 'No ranking IDs found', updated: 0, wpIds: [] }
  }

  const payload = await getPayload({ config })
  let updated = 0

  for (let index = 0; index < wpIds.length; index++) {
    const wpId = wpIds[index]
    const viewCount = wpIds.length - index

    const found = await payload.find({
      collection: 'posts',
      limit: 1,
      where: { wpId: { equals: wpId } },
    })

    const post = found.docs[0]
    if (!post) continue

    await payload.update({
      collection: 'posts',
      id: post.id,
      overrideAccess: true,
      data: { viewCount },
    })
    updated++
  }

  return {
    message: 'Popular ranking synced from live site',
    updated,
    wpIds: wpIds.slice(0, 10),
  }
}
