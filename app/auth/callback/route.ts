import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

/**
 * Handles OAuth (PKCE `code`) and email/magic-link (`token_hash`) returns.
 * On success the user lands on `next` (default /dashboard); on failure they
 * go back to /login with an error flag.
 */
/**
 * Only same-site paths are allowed as a post-login destination: one leading
 * slash and no backslashes. Anything else ("//evil.com", "@evil.com",
 * "https://…") falls back to the dashboard, closing the open-redirect hole.
 */
function safePath(raw: string | null) {
  if (raw && /^\/(?!\/)/.test(raw) && !raw.includes('\\')) return raw
  return '/dashboard'
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = safePath(searchParams.get('next'))

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
