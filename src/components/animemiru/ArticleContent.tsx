'use client'

import {
  ADSENSE_ARTICLE_SLOT_1,
  ADSENSE_ARTICLE_SLOT_2,
  isAdSenseEnabled,
} from '@/lib/adsenseConfig'
import type { ArticleContentSegment } from '@/lib/splitArticleContentForAds'

import { AdSenseUnit } from '@/components/animemiru/AdSenseUnit'

const INLINE_SLOTS = [ADSENSE_ARTICLE_SLOT_1, ADSENSE_ARTICLE_SLOT_2]

type ArticleContentProps = {
  segments: ArticleContentSegment[]
}

export function ArticleContent({ segments }: ArticleContentProps) {
  const showInlineAds = isAdSenseEnabled()

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === 'html') {
          return (
            <div
              dangerouslySetInnerHTML={{ __html: segment.html }}
              key={`html-${index}`}
            />
          )
        }

        if (!showInlineAds) return null

        const slot = INLINE_SLOTS[segment.slotIndex % INLINE_SLOTS.length]
        return (
          <AdSenseUnit
            key={`ad-${index}`}
            slot={slot}
            wrapperClassName="ad st-h-ad article-inline-ad"
          />
        )
      })}
    </>
  )
}
