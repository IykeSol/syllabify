'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useCookieConsent } from '@/components/cookie-consent'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

/**
 * AdSense slot. Renders a real ad only when AdSense is configured AND the
 * visitor accepted all cookies; otherwise a quiet, labelled placeholder so
 * the layout never shows a broken or empty box.
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
  const active = Boolean(client && slot && consent === 'all')

  useEffect(() => {
    if (active) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {
        /* adsbygoogle not ready */
      }
    }
  }, [active])

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
