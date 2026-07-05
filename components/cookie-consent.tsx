'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CONSENT_COOKIE = 'syllabify-consent'
const CONSENT_EVENT = 'syllabify-consent-change'

export type ConsentValue = 'all' | 'necessary'
/** 'pending' = still hydrating on the server — treat as "no decision yet". */
type ConsentState = ConsentValue | 'unset' | 'pending'

function readConsent(): ConsentState {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE}=(all|necessary)`),
  )
  return (match?.[1] as ConsentValue) ?? 'unset'
}

function writeConsent(value: ConsentValue) {
  // 12 months, site-wide.
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT))
}

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange)
  return () => window.removeEventListener(CONSENT_EVENT, onChange)
}

/** Live consent value — the cookie is the store, the banner writes to it. */
function useConsentState(): ConsentState {
  return useSyncExternalStore(subscribe, readConsent, () => 'pending')
}

/** True only after the visitor explicitly accepted all cookies. */
export function useCookieConsent(): ConsentValue | null {
  const state = useConsentState()
  return state === 'all' || state === 'necessary' ? state : null
}

/**
 * Cookie banner. Personalised ads (AdSense) only load after "Accept all" —
 * see AdSlot, which checks the same cookie.
 */
export function CookieConsent() {
  const state = useConsentState()

  // Nothing to ask while hydrating or once a choice has been made.
  if (state !== 'unset') return null

  function decide(value: ConsentValue) {
    writeConsent(value)
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-xl sm:flex-row sm:items-center sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <Cookie className="size-4.5" />
          </span>
          <p className="text-sm text-muted-foreground">
            We use cookies to keep you signed in and, if you allow it, to show
            the ads that keep Syllabify free.{' '}
            <Link href="/privacy" className="font-medium text-foreground underline-offset-2 hover:underline">
              Privacy policy
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
          <Button variant="outline" size="sm" onClick={() => decide('necessary')}>
            Necessary only
          </Button>
          <Button size="sm" onClick={() => decide('all')}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  )
}
