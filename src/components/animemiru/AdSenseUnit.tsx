'use client'

import { useEffect } from 'react'

import {
  ADSENSE_CLIENT,
  ADSENSE_ARTICLE_SLOT_1,
  ADSENSE_ARTICLE_SLOT_2,
  ADSENSE_INFEED_INTERVAL,
  ADSENSE_INFEED_LAYOUT_KEY,
  ADSENSE_INFEED_SLOT,
  ADSENSE_SIDEBAR_SLOT,
  isAdSenseEnabled,
} from '@/lib/adsenseConfig'

function pushAd() {
  try {
    const win = window as Window & { adsbygoogle?: unknown[] }
    win.adsbygoogle = win.adsbygoogle || []
    win.adsbygoogle.push({})
  } catch {
    // AdSense 読込前は無視
  }
}

type AdSenseUnitProps = {
  slot: string
  format?: 'auto' | 'fluid'
  layoutKey?: string
  wrapperClassName?: string
}

export function AdSenseUnit({
  slot,
  format = 'auto',
  layoutKey,
  wrapperClassName = 'ad',
}: AdSenseUnitProps) {
  useEffect(() => {
    if (!isAdSenseEnabled() || !slot) return
    pushAd()
  }, [slot])

  if (!isAdSenseEnabled() || !slot) return null

  return (
    <div className={wrapperClassName}>
      <ins
        className="adsbygoogle"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-format={format}
        data-ad-slot={slot}
        data-ad-layout-key={layoutKey}
        data-full-width-responsive={format === 'auto' ? 'true' : undefined}
        style={{ display: 'block' }}
      />
    </div>
  )
}

export function InFeedAdUnit() {
  return (
    <AdSenseUnit
      format="fluid"
      layoutKey={ADSENSE_INFEED_LAYOUT_KEY}
      slot={ADSENSE_INFEED_SLOT}
      wrapperClassName="ad st-infeed-adunit"
    />
  )
}

export function SidebarAdUnit() {
  return (
    <AdSenseUnit
      format="auto"
      slot={ADSENSE_SIDEBAR_SLOT}
      wrapperClassName="ad sidebar-adsense"
    />
  )
}

export function ArticleContentAds() {
  if (!isAdSenseEnabled()) return null

  return (
    <div className="adbox">
      <AdSenseUnit slot={ADSENSE_ARTICLE_SLOT_1} wrapperClassName="ad article-ad-slot" />
      <AdSenseUnit slot={ADSENSE_ARTICLE_SLOT_2} wrapperClassName="ad article-ad-slot article-ad-slot--second" />
    </div>
  )
}

export { ADSENSE_INFEED_INTERVAL }
