export const APP_NAME = 'Syllabify'
export const APP_TAGLINE = 'Learn smarter, not harder.'
export const APP_DESCRIPTION =
  'A focused learning platform for Nigerian university students and fresh graduates. Courses, notes, and progress tracking, all free.'

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

/**
 * True only when a real Supabase project is wired up. When false the app
 * runs in a local "preview" mode: middleware skips auth so the UI can be
 * inspected without a backend. Production deployments always set a real URL.
 */
export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return Boolean(url) && !url!.includes('placeholder')
}

/** Icon keys resolved to Lucide components on the client (see sidebar-nav). */
export type NavIconName =
  | 'dashboard'
  | 'courses'
  | 'overview'
  | 'manage-courses'
  | 'new-course'
  | 'universities'
  | 'settings'

export type NavItem = {
  label: string
  href: string
  icon: NavIconName
}

export const studentNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Browse courses', href: '/courses', icon: 'courses' },
]

export const adminNav: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: 'overview' },
  { label: 'Courses', href: '/admin/courses', icon: 'manage-courses' },
  { label: 'New course', href: '/admin/courses/new', icon: 'new-course' },
  { label: 'Universities', href: '/admin/universities', icon: 'universities' },
  { label: 'Settings', href: '/admin/settings', icon: 'settings' },
]

/** URL-safe slug from a title. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function initials(name?: string | null) {
  if (!name) return 'S'
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
