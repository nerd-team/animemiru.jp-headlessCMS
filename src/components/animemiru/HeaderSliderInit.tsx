'use client'

import { useEffect } from 'react'

const SLICK_OPTIONS = {
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  autoplay: true,
  dots: false,
  autoplaySpeed: 5000,
  fade: true,
  rtl: false,
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.body.appendChild(script)
  })
}

export function HeaderSliderInit() {
  useEffect(() => {
    let cancelled = false

    async function initSlider() {
      try {
        await loadScript('https://code.jquery.com/jquery-3.7.1.min.js')
        await loadScript('/theme/js/slick.js')
        await loadScript('/theme/js/base.js')

        if (cancelled) return

        const jQuery = (
          window as typeof window & {
            jQuery?: {
              (selector: string): {
                length: number
                hasClass(name: string): boolean
                data(key: string): Record<string, unknown> | undefined
                slick(options: Record<string, unknown>): void
              }
              fn?: { slick?: unknown }
            }
          }
        ).jQuery
        if (!jQuery?.fn?.slick) return

        const $slider = jQuery('.post-slider.header-post-slider')
        if (!$slider.length || $slider.hasClass('slick-initialized')) return

        const options = $slider.data('slick') || SLICK_OPTIONS
        $slider.slick(options)
      } catch {
        // slick 未読込時は静的表示のまま
      }
    }

    initSlider()

    return () => {
      cancelled = true
    }
  }, [])

  return null
}
