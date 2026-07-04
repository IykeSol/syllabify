'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, retryMessage } from '@/lib/rate-limit'
import type { LearnerTrack } from '@/types/database'

/**
 * Email auth runs through these Server Actions (instead of the browser
 * talking to Supabase directly) so every attempt passes the per-IP rate
 * limiter first — plain bot spam never reaches Supabase.
 * OAuth (Google/GitHub) stays client-side; the providers gate bots themselves.
 */

type AuthResult = { success?: true; error?: string }

async function clientIp() {
  const h = await headers()
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * The site origin, derived from the request (never from client input) so
 * email links can only ever point back at this deployment.
 */
async function requestOrigin() {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'https'
  if (host) return `${proto}://${host}`
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}

/** Same-site paths only; anything suspicious falls back to the dashboard. */
function safePath(raw?: string) {
  if (raw && /^\/(?!\/)/.test(raw) && !raw.includes('\\')) return raw
  return '/dashboard'
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function signInAction(input: {
  email: string
  password: string
}): Promise<AuthResult> {
  const ip = await clientIp()
  // 10 login attempts per 10 minutes per IP.
  const limit = rateLimit(`login:${ip}`, 10, 10 * 60 * 1000)
  if (!limit.ok) return { error: retryMessage(limit.retryAfter) }

  if (!isValidEmail(input.email) || !input.password) {
    return { error: 'Enter a valid email and password.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function signUpAction(input: {
  email: string
  password: string
  fullName: string
  track: LearnerTrack
  /** Honeypot — real users never fill this hidden field. */
  website?: string
}): Promise<AuthResult> {
  // Bots love hidden fields; silently pretend it worked.
  if (input.website) return { success: true }

  const ip = await clientIp()
  // 5 signups per hour per IP.
  const limit = rateLimit(`signup:${ip}`, 5, 60 * 60 * 1000)
  if (!limit.ok) return { error: retryMessage(limit.retryAfter) }

  if (!isValidEmail(input.email)) return { error: 'Enter a valid email.' }
  if (input.password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }
  if (!input.fullName.trim()) return { error: 'Your full name is required.' }
  if (input.track !== 'student' && input.track !== 'graduate') {
    return { error: 'Choose whether you are a student or a fresh graduate.' }
  }

  const origin = await requestOrigin()
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { full_name: input.fullName.trim(), track: input.track },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function magicLinkAction(input: {
  email: string
  next?: string
}): Promise<AuthResult> {
  const ip = await clientIp()
  // 3 magic links per 15 minutes per IP.
  const limit = rateLimit(`magic:${ip}`, 3, 15 * 60 * 1000)
  if (!limit.ok) return { error: retryMessage(limit.retryAfter) }

  if (!isValidEmail(input.email)) return { error: 'Enter a valid email.' }

  const origin = await requestOrigin()
  const next = safePath(input.next)
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email: input.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })
  if (error) return { error: error.message }
  return { success: true }
}
