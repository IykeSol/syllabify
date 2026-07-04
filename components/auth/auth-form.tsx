'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Mail, ArrowLeft, GraduationCap, BriefcaseBusiness } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { signInAction, signUpAction, magicLinkAction } from '@/lib/auth-actions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleIcon, GitHubIcon } from '@/components/icons'
import type { LearnerTrack } from '@/types/database'

type Mode = 'login' | 'signup'
type Provider = 'google' | 'github'

const tracks: {
  value: LearnerTrack
  label: string
  hint: string
  icon: typeof GraduationCap
}[] = [
  {
    value: 'student',
    label: 'University student',
    hint: 'Course materials & digital skills',
    icon: GraduationCap,
  },
  {
    value: 'graduate',
    label: 'Fresh graduate',
    hint: 'Trainee brochures & digital skills',
    icon: BriefcaseBusiness,
  },
]

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const params = useSearchParams()
  // Same-site paths only, so ?next= can never bounce users to another site.
  const rawNext = params.get('next') ?? ''
  const next =
    /^\/(?!\/)/.test(rawNext) && !rawNext.includes('\\') ? rawNext : '/dashboard'

  const [loading, setLoading] = useState<null | 'google' | 'github' | 'email' | 'magic'>(null)
  const [useMagicLink, setUseMagicLink] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [track, setTrack] = useState<LearnerTrack>('student')
  // Honeypot — hidden from humans, bots fill it and get silently dropped.
  const [website, setWebsite] = useState('')

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const supabase = createClient()

  async function signInWithProvider(provider: Provider) {
    setLoading(provider)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
      })
      if (error) throw error
    } catch (err) {
      toast.error((err as Error).message || 'Could not start sign-in.')
      setLoading(null)
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading('magic')
    const res = await magicLinkAction({ email, next })
    setLoading(null)
    if (res.error) {
      toast.error(res.error)
      return
    }
    setSentTo(email)
  }

  async function handleEmailPassword(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'signup' && password !== confirm) {
      toast.error('Passwords do not match.')
      return
    }
    setLoading('email')
    if (mode === 'signup') {
      const res = await signUpAction({ email, password, fullName, track, website })
      setLoading(null)
      if (res.error) {
        toast.error(res.error)
        return
      }
      setSentTo(email)
    } else {
      const res = await signInAction({ email, password })
      setLoading(null)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Welcome back!')
      // Full navigation (not router.push) so every server component re-reads
      // the fresh session cookie; also avoids the push+refresh race.
      window.location.assign(next)
    }
  }

  // Confirmation screen after signup / magic-link send.
  if (sentTo) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
          <Mail className="size-7" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Check your inbox</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          We sent a {mode === 'signup' ? 'verification' : 'sign-in'} link to{' '}
          <span className="font-medium text-foreground">{sentTo}</span>. Open it to
          {mode === 'signup' ? ' verify your email and start learning.' : ' continue.'}
        </p>
        <Button
          variant="ghost"
          className="mt-6"
          onClick={() => {
            setSentTo(null)
            setUseMagicLink(false)
          }}
        >
          <ArrowLeft className="size-4" /> Back
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {mode === 'login'
            ? 'Sign in to continue learning.'
            : 'Start learning for free. No card needed.'}
        </p>
      </div>

      <div className="grid gap-3">
        <Button
          variant="outline"
          className="h-11"
          disabled={loading !== null}
          onClick={() => signInWithProvider('google')}
        >
          {loading === 'google' ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GoogleIcon className="size-4" />
          )}
          Continue with Google
        </Button>
        <Button
          variant="outline"
          className="h-11"
          disabled={loading !== null}
          onClick={() => signInWithProvider('github')}
        >
          {loading === 'github' ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GitHubIcon className="size-4" />
          )}
          Continue with GitHub
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {useMagicLink ? (
        <form onSubmit={handleMagicLink} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="magic-email">Email</Label>
            <Input
              id="magic-email"
              type="email"
              autoComplete="email"
              placeholder="you@university.edu.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="h-11" disabled={loading !== null}>
            {loading === 'magic' && <Loader2 className="size-4 animate-spin" />}
            Send magic link
          </Button>
          <button
            type="button"
            onClick={() => setUseMagicLink(false)}
            className="text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Use password instead
          </button>
        </form>
      ) : (
        <form onSubmit={handleEmailPassword} className="grid gap-4">
          {mode === 'signup' && (
            <>
              <div className="grid gap-2">
                <Label>I am a…</Label>
                <div className="grid grid-cols-2 gap-2">
                  {tracks.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTrack(t.value)}
                      aria-pressed={track === t.value}
                      className={cn(
                        'rounded-xl border p-3 text-left transition-colors',
                        track === t.value
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:bg-muted/50',
                      )}
                    >
                      <t.icon
                        className={cn(
                          'size-5',
                          track === t.value ? 'text-primary' : 'text-muted-foreground',
                        )}
                      />
                      <p className="mt-2 text-sm font-medium">{t.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{t.hint}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              {/* Honeypot field — visually hidden, never filled by humans */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] size-px opacity-0"
              />
            </>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@university.edu.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              // New accounts need 8+; login stays lax for older passwords.
              minLength={mode === 'signup' ? 8 : 6}
            />
          </div>
          {mode === 'signup' && (
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
              />
            </div>
          )}
          <Button type="submit" className="h-11" disabled={loading !== null}>
            {loading === 'email' && <Loader2 className="size-4 animate-spin" />}
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>
          <button
            type="button"
            onClick={() => setUseMagicLink(true)}
            className="text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Email me a magic link instead
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
