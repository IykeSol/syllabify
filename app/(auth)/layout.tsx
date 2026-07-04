import Link from 'next/link'
import { GraduationCap, CheckCircle2 } from 'lucide-react'

const perks = [
  'Free forever, no card required',
  'Curated courses, notes & past questions',
  'Track your progress as you learn',
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-white/10 blur-3xl"
        />

        <Link href="/" className="relative inline-flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-white/15">
            <GraduationCap className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Syllabify</span>
        </Link>

        <div className="relative">
          <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight">
            Learn smarter, not harder.
          </h2>
          <p className="mt-3 max-w-sm text-primary-foreground/80">
            Everything you need to ace your courses, in one calm, focused place.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                <CheckCircle2 className="size-5 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-primary-foreground/70">
          Built for students in Nigeria.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 lg:hidden"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Syllabify</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
