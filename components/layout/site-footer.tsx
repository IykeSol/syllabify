import Link from 'next/link'
import { Logo } from '@/components/logo'

const columns = [
  {
    heading: 'Product',
    links: [
      { href: '/#features', label: 'Features' },
      { href: '/#courses', label: 'Courses' },
      { href: '/#pricing', label: 'Pricing' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { href: '/login', label: 'Log in' },
      { href: '/signup', label: 'Sign up' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/#', label: 'Privacy' },
      { href: '/#', label: 'Terms' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Free courses, notes, and progress tracking for Nigerian
              university students and fresh graduates.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading}>
                <h4 className="text-sm font-semibold">{col.heading}</h4>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Syllabify. All rights reserved.</p>
          <p>Built for students in Nigeria.</p>
        </div>
      </div>
    </footer>
  )
}
