import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Code2,
  FileText,
  GraduationCap,
  Layers,
  LineChart,
  School,
  Search,
  Smartphone,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { AdSlot } from '@/components/ads/ad-slot'
import { CourseCard } from '@/components/courses/course-card'
import { getPublishedCourses } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Syllabify | Learn smarter, not harder',
  description:
    'Free courses, notes, and past questions for Nigerian university students and fresh graduates.',
}

const stats = [
  { icon: School, value: '100+', label: 'Universities covered', tint: 'bg-blue-500/10 text-blue-600' },
  { icon: Layers, value: '100+', label: 'Departments', tint: 'bg-violet-500/10 text-violet-600' },
  { icon: BookOpen, value: '3', label: 'Learning tracks', tint: 'bg-emerald-500/10 text-emerald-600' },
  { icon: Star, value: '₦0', label: 'Free forever', tint: 'bg-amber-500/10 text-amber-600' },
]

const tracks = [
  {
    icon: GraduationCap,
    tint: 'bg-blue-500/10 text-blue-600',
    ring: 'hover:border-blue-300',
    title: 'University courses',
    body: 'Course materials, notes, and past questions mapped to your university and department.',
    who: 'For university students',
  },
  {
    icon: Code2,
    tint: 'bg-emerald-500/10 text-emerald-600',
    ring: 'hover:border-emerald-300',
    title: 'Digital skills',
    body: 'Programming, frontend development, machine learning, design. Job-ready skills for everyone.',
    who: 'For students & graduates',
  },
  {
    icon: BriefcaseBusiness,
    tint: 'bg-amber-500/10 text-amber-600',
    ring: 'hover:border-amber-300',
    title: 'Graduate trainee brochures',
    body: 'Curated brochures and prep material for graduate trainee programmes and aptitude tests.',
    who: 'For fresh graduates',
  },
]

const features = [
  {
    icon: BookOpen,
    tint: 'bg-blue-500/10 text-blue-600',
    title: 'Curated courses',
    body: 'Hand-picked courses built around what you actually study. No fluff.',
  },
  {
    icon: FileText,
    tint: 'bg-violet-500/10 text-violet-600',
    title: 'Notes & past questions',
    body: 'Lecture notes, summaries, and past questions, all in one place.',
  },
  {
    icon: LineChart,
    tint: 'bg-emerald-500/10 text-emerald-600',
    title: 'Track your progress',
    body: 'See what you’ve covered and pick up exactly where you left off.',
  },
  {
    icon: Smartphone,
    tint: 'bg-amber-500/10 text-amber-600',
    title: 'Learn on any device',
    body: 'A clean, fast experience that works beautifully on your phone.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Create a free account',
    body: "Tell us if you're a university student or a fresh graduate. That's all we need.",
  },
  {
    step: '02',
    title: 'Pick your path',
    body: 'Students choose their school & department. Graduates browse trainee brochures. Everyone gets digital skills.',
  },
  {
    step: '03',
    title: 'Learn anywhere',
    body: 'Enrol in one click and study on your phone or laptop. Your progress saves itself.',
  },
]

export default async function LandingPage() {
  const courses = (await getPublishedCourses()).slice(0, 6)

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Soft two-tone wash, like a sunrise over the page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(50%_60%_at_18%_10%,rgba(37,99,235,0.10),transparent_70%),radial-gradient(45%_55%_at_85%_8%,rgba(251,113,133,0.10),transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-40 -z-10 size-72 rounded-full bg-primary/5 blur-3xl"
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-14">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
                <Sparkles className="size-3.5 text-primary" />
                The smarter way to learn in Nigeria
              </Badge>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Engaging &amp; accessible learning{' '}
                <span className="relative text-primary">
                  for every student
                  <svg
                    aria-hidden
                    viewBox="0 0 200 9"
                    className="absolute -bottom-2 left-0 hidden w-full text-primary/30 lg:block"
                    fill="none"
                  >
                    <path
                      d="M2 7C60 2 140 2 198 7"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
                Course materials for 100+ Nigerian universities, graduate
                trainee brochures, and digital skills. All free, in one calm,
                focused place.
              </p>

              {/* Search — lands on the catalogue after sign-in */}
              <form
                action="/courses"
                className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-border bg-card p-1.5 pl-4 shadow-sm lg:mx-0"
              >
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <input
                  type="search"
                  name="q"
                  placeholder="Search a course, skill, or school…"
                  className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <Button type="submit" size="sm" className="shrink-0 rounded-full">
                  Search
                </Button>
              </form>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/signup">
                    Get started free <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/login">I have an account</Link>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground lg:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-primary" /> 100% free
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-primary" /> No card required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-primary" /> Works on any phone
                </span>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-primary/25 via-rose-300/20 to-amber-200/20 blur-2xl"
              />
              {/* Decorative shapes, Dreams-style */}
              <div
                aria-hidden
                className="absolute -right-4 -top-6 size-16 rounded-2xl bg-amber-300/60 blur-[1px] motion-safe:animate-pulse"
              />
              <div
                aria-hidden
                className="absolute -left-6 bottom-24 size-10 rounded-full bg-primary/30"
              />
              <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-primary/10">
                <Image
                  src="/images/hero-students.jpg"
                  alt="Nigerian students learning together at a laptop"
                  width={1200}
                  height={800}
                  preload
                  sizes="(min-width: 1024px) 50vw, (min-width: 640px) 28rem, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Floating stat chips */}
              <div className="absolute -left-4 bottom-12 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:flex">
                <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Star className="size-4" />
                </span>
                <div className="text-xs">
                  <p className="font-semibold leading-none">100% free</p>
                  <p className="mt-0.5 text-muted-foreground">no card needed</p>
                </div>
              </div>
              <div className="absolute -right-3 top-10 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:flex">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Users className="size-4" />
                </span>
                <div className="text-xs">
                  <p className="font-semibold leading-none">100+ universities</p>
                  <p className="mt-0.5 text-muted-foreground">students &amp; grads</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stat chips */}
        <section className="mx-auto -mt-2 max-w-6xl px-4 pb-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <Card
                key={s.label}
                className="flex flex-row items-center gap-3.5 p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
              >
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${s.tint}`}>
                  <s.icon className="size-5" />
                </span>
                <div>
                  <p className="text-xl font-semibold leading-none tracking-tight">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Learning tracks */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Choose your path
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                One platform, three ways to grow
              </h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                Tell us where you are on your journey and we show you exactly
                what you need, nothing else.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/signup">
                Start free <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {tracks.map((t) => (
              <Card
                key={t.title}
                className={`group border p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${t.ring}`}
              >
                <span className={`grid size-12 place-items-center rounded-2xl ${t.tint}`}>
                  <t.icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t.body}
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t.who}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Ad — after tracks */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LANDING} />
        </div>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Why Syllabify
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Everything you need to do well
            </h2>
            <p className="mt-3 text-muted-foreground">
              Built to keep you focused on learning and nothing else.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card
                key={f.title}
                className="p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`grid size-11 place-items-center rounded-xl ${f.tint}`}>
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Course preview */}
        <section
          id="courses"
          className="relative border-y border-border bg-[radial-gradient(60%_100%_at_50%_0%,rgba(37,99,235,0.06),transparent_70%)] py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  What&apos;s new
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  Fresh from the catalogue
                </h2>
                <p className="mt-3 max-w-md text-muted-foreground">
                  A taste of what&apos;s inside. Sign up free to explore everything.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/signup">
                  Browse all courses <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            {courses.length > 0 ? (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    href="/signup"
                    footer={
                      <Button asChild variant="secondary" className="w-full">
                        <Link href="/signup">View course</Link>
                      </Button>
                    }
                  />
                ))}
              </div>
            ) : (
              <Card className="mt-10 p-12 text-center">
                <p className="text-muted-foreground">
                  New courses are added every week.{' '}
                  <Link href="/signup" className="font-medium text-primary hover:underline">
                    Sign up
                  </Link>{' '}
                  to be the first to know.
                </p>
              </Card>
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              From signup to studying in under a minute
            </h2>
          </div>
          <div className="relative mt-12 grid gap-8 md:grid-cols-3">
            <div
              aria-hidden
              className="absolute left-[16%] right-[16%] top-7 hidden border-t-2 border-dashed border-primary/20 md:block"
            />
            {steps.map((s) => (
              <div key={s.step} className="relative text-center">
                <span className="relative z-10 mx-auto grid size-14 place-items-center rounded-full border border-primary/20 bg-background text-lg font-semibold text-primary shadow-sm">
                  {s.step}
                </span>
                <h3 className="mt-4 font-semibold tracking-tight">{s.title}</h3>
                <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Pricing
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Simple, honest pricing
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything on Syllabify is free. No card, no catch.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-md">
            <Card className="flex flex-col p-7 ring-1 ring-primary/20">
              <h3 className="text-lg font-semibold">Free</h3>
              <p className="mt-4 text-4xl font-semibold tracking-tight">
                ₦0<span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {['Access all courses', 'Notes & past questions', 'Progress tracking', 'Learn on any device'].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <Button asChild className="mt-7 w-full">
                <Link href="/signup">Get started</Link>
              </Button>
            </Card>
          </div>
        </section>

        {/* Final CTA + footer ad */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <Card className="relative overflow-hidden border-0 bg-primary p-10 text-center text-primary-foreground sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_80%_0%,rgba(255,255,255,0.15),transparent_60%)]"
            />
            <h2 className="relative mx-auto max-w-xl text-3xl font-semibold tracking-tight">
              Ready to study smarter?
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-primary-foreground/80">
              Join free today and get instant access to every course.
            </p>
            <Button asChild size="lg" variant="secondary" className="relative mt-7 rounded-full">
              <Link href="/signup">
                Create your free account <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Card>

          <div className="mt-12">
            <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LANDING} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
