export const YOUTUBE_SHORTS_HANDLE = '-animemiru2785'

export const YOUTUBE_SHORTS_CHANNEL_URL = `https://www.youtube.com/@${YOUTUBE_SHORTS_HANDLE}/shorts`

const FALLBACK_SHORT_IDS = [
  'qdFQ5uviO3g',
  'ldp-LaderRg',
  'Negc34yJLEI',
  'fnj3hovReis',
]

export async function fetchYoutubeShortIds(limit = 4): Promise<string[]> {
  try {
    const res = await fetch(YOUTUBE_SHORTS_CHANNEL_URL, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; animemiru-bot/1.0)',
      },
    })

    if (!res.ok) return FALLBACK_SHORT_IDS.slice(0, limit)

    const html = await res.text()
    const ids = [
      ...new Set(
        [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map((match) => match[1]),
      ),
    ]

    if (ids.length === 0) return FALLBACK_SHORT_IDS.slice(0, limit)

    return ids.slice(0, limit)
  } catch {
    return FALLBACK_SHORT_IDS.slice(0, limit)
  }
}
