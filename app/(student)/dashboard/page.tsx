import Link from 'next/link'
import type { Metadata } from 'next'
import {
  BookOpen,
  Compass,
  Play,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Hand,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/components/courses/course-card'
import { EmptyState } from '@/components/empty-state'
import { TrackPrompt } from '@/components/track-prompt'
import { getCurrentUser, getCurrentProfile, getDashboard } from '@/lib/queries'

export const metadata: Metadata = { title: 'Dashboard' }

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  )
}

export default async function DashboardPage() {
  const [user, profile] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile(),
  ])
  const { items } = user ? await getDashboard(user.id) : { items: [] }
  const firstName = (profile?.full_name ?? '').split(' ')[0]

  const enrolled = items.length
  const completed = items.filter((i) => i.progress >= 100).length
  const inProgress = items.filter((i) => i.progress > 0 && i.progress < 100)
  const avgProgress = enrolled
    ? Math.round(items.reduce((s, i) => s + i.progress, 0) / enrolled)
    : 0
  // Best "resume" pick: the furthest-along unfinished course, else the newest.
  const resume =
    [...inProgress].sort((a, b) => b.progress - a.progress)[0] ??
    items.find((i) => i.progress < 100) ??
    items[0]

  const allDone = enrolled > 0 && completed === enrolled
  const heroSubtitle = allDone
    ? "You've finished everything you're enrolled in. Time for something new."
    : resume
      ? `You're ${resume.progress}% through "${resume.course.title}". Keep the momentum going.`
      : 'Start your first course today. Every lesson is free.'

  return (
    <div className="space-y-8">
      {/* First-run: OAuth signups arrive without a track */}
      {profile && !profile.track && <TrackPrompt />}

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/12 via-primary/5 to-transparent p-6 sm:p-8">
        <Sparkles className="absolute -right-4 -top-4 size-28 text-primary/10" />
        <div className="relative">
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
            <span>Welcome back{firstName ? `, ${firstName}` : ''}</span>
            <Hand className="size-6 -rotate-12 text-primary sm:size-7" />
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{heroSubtitle}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {resume && !allDone ? (
              <Button asChild size="lg">
                <Link href={`/courses/${resume.course.slug}`}>
                  <Play className="size-4" /> Continue learning
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href="/courses">
                  <Compass className="size-4" /> Explore courses
                </Link>
              </Button>
            )}
            {enrolled > 0 && (
              <Button asChild size="lg" variant="outline">
                <Link href="/courses">
                  <BookOpen className="size-4" /> Browse catalogue
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      {enrolled > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={BookOpen} label="Enrolled" value={enrolled} />
          <StatCard icon={Clock} label="In progress" value={inProgress.length} />
          <StatCard icon={CheckCircle2} label="Completed" value={completed} />
          <StatCard icon={TrendingUp} label="Avg progress" value={`${avgProgress}%`} />
        </div>
      )}

      {/* Courses or empty */}
      {enrolled === 0 ? (
        <EmptyState
          icon={Compass}
          title="You haven't enrolled in any courses yet"
          description="Browse the catalogue and enrol in your first one. Every course is free."
          action={
            <Button asChild>
              <Link href="/courses">
                <BookOpen className="size-4" /> Browse courses
              </Link>
            </Button>
          }
        />
      ) : (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Your courses
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map(({ course, progress }) => (
              <CourseCard
                key={course.id}
                course={course}
                href={`/courses/${course.slug}`}
                progress={progress}
                footer={
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/courses/${course.slug}`}>
                      {progress >= 100 ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
                    </Link>
                  </Button>
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
