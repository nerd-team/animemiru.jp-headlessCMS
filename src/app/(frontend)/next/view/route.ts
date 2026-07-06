import { NextResponse } from 'next/server'

import { incrementViewCount } from '@/lib/incrementViewCount'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_VIEW_TRACKING) {
    return NextResponse.json({ ok: true })
  }

  try {
    const { postId } = (await request.json()) as { postId?: string }
    if (!postId) {
      return NextResponse.json({ error: 'postId required' }, { status: 400 })
    }

    await incrementViewCount(postId)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to increment view' }, { status: 500 })
  }
}
