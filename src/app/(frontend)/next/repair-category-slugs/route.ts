import { NextResponse } from 'next/server'

import { isDevOnlyRouteAllowed } from '@/lib/devOnlyRoute'
import { repairCategorySlugs } from '@/lib/repairCategorySlugs'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** 移行済みカテゴリの slug をデコードして正規化 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')
  const authorized =
    isDevOnlyRouteAllowed() || (cronSecret && authHeader === `Bearer ${cronSecret}`)

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const result = await repairCategorySlugs()
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Repair failed' },
      { status: 500 },
    )
  }
}
