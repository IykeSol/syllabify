import { Fragment, Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchX } from 'lucide-react'
import { CourseCard } from '@/components/courses/course-card'
import { CourseFilters } from '@/components/courses/course-filters'
import { EnrollButton } from '@/components/courses/enroll-button'
import { AdSlot } from '@/components/ads/ad-slot'
import { EmptyState } from '@/components/empty-state'
import {
  getCurrentUser,
  getCurrentProfile,
  getPublishedCourses,
  getCategories,
  getEnrollmentIds,
  getActiveUniversities,
  getDepartments,
  type CourseCard as CourseCardType,
} from '@/lib/queries'

export const metadata: Metadata = { title: 'Browse courses' }

/**
 * Split courses into level bands (100 to 600), newest levels of study last,
 * with everything that has no level (digital skills, brochures, unplaced
 * courses) collected at the end. Within a band, general studies courses come
 * first, then first semester before second.
 */
function groupByLevel(courses: CourseCardType[]) {
  const bands = new Map<number, CourseCardType[]>()
  const noLevel: CourseCardType[] = []
  for (const c of courses) {
    if (c.level) {
      const list = bands.get(c.level) ?? []
      list.push(c)
      bands.set(c.level, list)
    } else {
      noLevel.push(c)
    }
  }
  const order = (c: CourseCardType) =>
    (c.is_general ? 0 : 1) * 10 + (c.semester ?? 9)
  const leveled = [...bands.entries()]
    .sort(([a], [b]) => a - b)
    .map(([level, list]) => ({
      level,
      courses: [...list].sort((a, b) => order(a) - order(b)),
    }))
  return { leveled, noLevel }
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    category?: string
    kind?: string
    university?: string
    department?: string
    level?: string
    semester?: string
  }>
}) {
  const sp = await searchParams
  const profile = await getCurrentProfile()
  const track = profile?.track ?? null
  const [courses, categories, universities, departments, user] =
    await Promise.all([
      getPublishedCourses({
        search: sp.q,
        category: sp.category,
        kind: sp.kind,
        track,
        university: sp.university,
        department: sp.department,
        level: sp.level,
        semester: sp.semester,
      }),
      getCategories(),
      getActiveUniversities(),
      getDepartments(),
      getCurrentUser(),
    ])
  const enrolledIds = new Set(user ? await getEnrollmentIds(user.id) : [])

  const { leveled, noLevel } = groupByLevel(courses)
  // Only bother with level headings when there's more than one band to show.
  const grouped = leveled.length > 1

  const renderCard = (course: CourseCardType) => (
    <CourseCard
      key={course.id}
      course={course}
      href={`/courses/${course.slug}`}
      footer={
        <EnrollButton
          courseId={course.id}
          slug={course.slug}
          enrolled={enrolledIds.has(course.id)}
        />
      }
    />
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Browse courses</h1>
        <p className="mt-1 text-muted-foreground">
          Free courses, notes, and past questions. Enrol in one click.
        </p>
      </div>

      <Suspense>
        <CourseFilters
          categories={categories}
          universities={universities}
          departments={departments}
          track={track}
        />
      </Suspense>

      {courses.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No courses found"
          description="Try a different search or filter. New courses land every week."
        />
      ) : grouped ? (
        <div className="space-y-10">
          {leveled.map(({ level, courses: band }) => (
            <section key={level} className="space-y-4">
              <div className="flex items-baseline gap-3 border-b border-border pb-2">
                <h2 className="text-lg font-semibold tracking-tight">
                  {level} Level
                </h2>
                <span className="text-sm text-muted-foreground">
                  {band.length} course{band.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {band.map(renderCard)}
              </div>
            </section>
          ))}
          {noLevel.length > 0 && (
            <section className="space-y-4">
              <div className="border-b border-border pb-2">
                <h2 className="text-lg font-semibold tracking-tight">
                  More for you
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {noLevel.map(renderCard)}
              </div>
            </section>
          )}
          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_COURSES} />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, i) => (
            <Fragment key={course.id}>
              {renderCard(course)}
              {i === 5 && courses.length > 6 && (
                <div className="sm:col-span-2 xl:col-span-3">
                  <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_COURSES} />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
