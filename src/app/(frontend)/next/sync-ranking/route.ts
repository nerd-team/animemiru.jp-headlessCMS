import { NextResponse } from 'next/server'

import { syncPopularRankingFromLive } from '@/lib/syncPopularRanking'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const result = await syncPopularRankingFromLive()
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 },
    )
  }
}
