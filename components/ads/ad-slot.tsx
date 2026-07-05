'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useCookieConsent } from '@/components/cookie-consent'

declare global {
  interface Window {
    adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: number }
  }
}

/**
 * AdSense slot. Ads keep Syllabify free, so every visitor who has answered
 * the cookie banner gets them:
 *   · "Accept all"      → personalised ads
 *   · "Necessary only"  → non-personalised ads (based on the page, not the
 *                         person — Google's requestNonPersonalizedAds flag)
 * Before a choice is made (or if AdSense isn't configured) we render a quiet
 * labelled placeholder so the layout never shows a broken or empty box.
 */
export function AdSlot({
  slot,
  className,
  format = 'auto',
}: {
  slot?: string
  className?: string
  format?: string
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const consent = useCookieConsent()
  const active = Boolean(client && slot && consent !== null)
  const nonPersonalized = consent === 'necessary'

  useEffect(() => {
    if (active) {
      try {
        const ads = (window.adsbygoogle = window.adsbygoogle || [])
        ads.requestNonPersonalizedAds = nonPersonalized ? 1 : 0
        ads.push({})
      } catch {
        /* adsbygoogle not ready */
      }
    }
  }, [active, nonPersonalized])

  if (!active) {
    return (
      <div
        aria-hidden
        className={cn(
          'flex min-h-24 w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground',
          className,
        )}
      >
        Advertisement
      </div>
    )
  }

  return (
    <ins
      className={cn('adsbygoogle block', className)}
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
