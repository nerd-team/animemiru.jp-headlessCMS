import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { enrichContentHtml } from '@/lib/enrichContentHtml'
import { isDevOnlyRouteAllowed } from '@/lib/devOnlyRoute'

/** 既存記事の contentHtml に alt / lazy load を一括付与 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')
  const authorized =
    isDevOnlyRouteAllowed() || (cronSecret && authHeader === `Bearer ${cronSecret}`)

  if (!authorized) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const payload = await getPayload({ config })
  let updated = 0
  let page = 1
  let hasMore = true

  while (hasMore) {
    const result = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 100,
      page,
      where: { contentHtml: { exists: true } },
      select: { id: true, title: true, contentHtml: true },
    })

    for (const post of result.docs) {
      if (!post.contentHtml || !post.title) continue
      const enriched = enrichContentHtml(post.contentHtml, post.title)
      if (enriched === post.contentHtml) continue

      await payload.update({
        collection: 'posts',
        id: post.id,
        data: { contentHtml: enriched },
        overrideAccess: true,
      })
      updated++
    }

    hasMore = result.hasNextPage
    page++
  }

  return NextResponse.json({ message: 'Content HTML enriched', updated })
}
