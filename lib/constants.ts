import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FolderKanban,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export const APP_NAME = 'Syllabify'
export const APP_TAGLINE = 'Learn smarter, not harder.'
export const APP_DESCRIPTION =
  'A focused learning platform for Nigerian university students and fresh graduates. Courses, notes, and progress tracking — free.'

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

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export const studentNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Browse courses', href: '/courses', icon: BookOpen },
]

export const adminNav: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Courses', href: '/admin/courses', icon: FolderKanban },
  { label: 'New course', href: '/admin/courses/new', icon: GraduationCap },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
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
