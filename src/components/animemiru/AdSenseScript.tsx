import Script from 'next/script'

import { ADSENSE_CLIENT, isAdSenseEnabled } from '@/lib/adsenseConfig'

export function AdSenseScript() {
  if (!isAdSenseEnabled()) return null

  return (
    <Script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      strategy="afterInteractive"
    />
  )
}
