import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { isSupabaseConfigured } from '@/lib/constants'

const STUDENT_PREFIXES = ['/dashboard', '/courses']
const ADMIN_PREFIX = '/admin'
const AUTH_ROUTES = ['/login', '/signup']

/** Copy refreshed auth cookies onto a redirect response. */
function redirectWithCookies(url: URL, from: NextResponse): NextResponse {
  const res = NextResponse.redirect(url)
  from.cookies.getAll().forEach((c) => res.cookies.set(c))
  return res
}

export async function proxy(request: NextRequest) {
  // Local preview mode (no real backend): let everything through so the
  // UI can be inspected. Production always has a real Supabase URL.
  if (!isSupabaseConfigured()) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl
  const { response, user } = await updateSession(request)

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  const isStudentRoute = STUDENT_PREFIXES.some((r) => pathname.startsWith(r))
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX)

  // Signed-in users should not see auth pages.
  if (isAuthRoute && user) {
    return redirectWithCookies(new URL('/dashboard', request.url), response)
  }

  // Protected student routes require a session.
  if ((isStudentRoute || isAdminRoute) && !user) {
    const url = new URL('/login', request.url)
    // Keep the query string so e.g. a landing-page search survives login.
    url.searchParams.set('next', pathname + request.nextUrl.search)
    return redirectWithCookies(url, response)
  }

  // Admin routes require the configured admin email.
  if (isAdminRoute && user) {
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
    if (!adminEmail || user.email?.toLowerCase() !== adminEmail) {
      return redirectWithCookies(new URL('/dashboard', request.url), response)
    }
  }

  return response
}

export const config = {
  // Run on everything except static assets and image files.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
