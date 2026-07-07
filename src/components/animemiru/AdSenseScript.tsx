import Script from 'next/script'

import { ADSENSE_CLIENT, isAdSenseEnabled } from '@/lib/adsenseConfig'

export function AdSenseScript() {
  if (!isAdSenseEnabled()) return null

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: `(window.adsbygoogle=window.adsbygoogle||[]).push({google_ad_client:"${ADSENSE_CLIENT}",enable_page_level_ads:false});`,
        }}
        id="adsense-disable-auto"
        strategy="beforeInteractive"
      />
      <Script
        async
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        strategy="afterInteractive"
      />
    </>
  )
}
