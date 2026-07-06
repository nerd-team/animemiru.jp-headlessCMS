import { NextResponse } from 'next/server'

import { seedDemoPosts } from '@/lib/seedDemoPosts'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const result = await seedDemoPosts()
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Seed failed' },
      { status: 500 },
    )
  }
}
