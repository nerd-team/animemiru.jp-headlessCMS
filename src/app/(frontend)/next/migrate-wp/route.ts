import { NextResponse } from 'next/server'

import { migrateFromWordPress } from '@/lib/wpMigrate'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') || process.env.WP_MIGRATE_LIMIT || 50)
  const startPage = Number(searchParams.get('page') || process.env.WP_MIGRATE_PAGE || 1)
  const downloadImages = searchParams.get('images') !== 'false'
  const dryRun = searchParams.get('dryRun') === 'true'

  try {
    const result = await migrateFromWordPress({
      limit,
      startPage,
      downloadImages,
      dryRun,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Migration failed' },
      { status: 500 },
    )
  }
}
