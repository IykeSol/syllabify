import 'server-only'

/**
 * Tiny in-memory sliding-window rate limiter for auth endpoints.
 *
 * Good enough to stop naive bot spam on a single server / warm serverless
 * instance. Each isolated instance keeps its own window, so treat the limits
 * as "per instance" — swap in Upstash/Redis if you ever need a global limit.
 */

type Window = { hits: number[] }

const windows = new Map<string, Window>()

// Periodically drop stale keys so the map can't grow unbounded.
const SWEEP_EVERY_MS = 10 * 60 * 1000
let lastSweep = Date.now()

function sweep(now: number, windowMs: number) {
  if (now - lastSweep < SWEEP_EVERY_MS) return
  lastSweep = now
  for (const [key, w] of windows) {
    if (w.hits.every((t) => now - t > windowMs)) windows.delete(key)
  }
}

export type RateLimitResult = {
  ok: boolean
  /** Seconds until the caller may retry (only when blocked). */
  retryAfter: number
}

/**
 * Record one attempt for `key` and report whether it is allowed.
 * `limit` attempts are allowed per sliding `windowMs`.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  sweep(now, windowMs)

  const w = windows.get(key) ?? { hits: [] }
  w.hits = w.hits.filter((t) => now - t < windowMs)

  if (w.hits.length >= limit) {
    windows.set(key, w)
    const retryAfter = Math.ceil((w.hits[0] + windowMs - now) / 1000)
    return { ok: false, retryAfter: Math.max(retryAfter, 1) }
  }

  w.hits.push(now)
  windows.set(key, w)
  return { ok: true, retryAfter: 0 }
}

/** Human-friendly "try again in …" string. */
export function retryMessage(seconds: number) {
  if (seconds >= 120) return `Too many attempts. Try again in ${Math.ceil(seconds / 60)} minutes.`
  return `Too many attempts. Try again in ${seconds} seconds.`
}
