import Link from 'next/link'
import { ArrowLeft, BookOpen, FileText, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CourseReader } from '@/components/courses/course-reader'
import { EnrollButton } from '@/components/courses/enroll-button'
import type { Course, Category, Material } from '@/types/database'

type CourseWithCat = Course & {
  categories: Pick<Category, 'id' | 'name' | 'slug'> | null
}

export function CourseDetail({
  course,
  materials,
  enrolled,
  slug,
  activeId,
  completedIds,
}: {
  course: CourseWithCat
  materials: Material[]
  enrolled: boolean
  slug: string
  activeId?: string
  completedIds: Set<string>
}) {
  return (
    <div className="space-y-6">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All courses
      </Link>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative aspect-[21/9] w-full bg-muted">
          {course.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnail_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-transparent text-primary">
              <BookOpen className="size-12 opacity-40" />
            </div>
          )}
        </div>
        <div className="p-6">
          {course.categories && (
            <Badge variant="secondary">{course.categories.name}</Badge>
          )}
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {course.title}
          </h1>
          {course.description && (
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {course.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <FileText className="size-4" />
            {enrolled
              ? `${materials.length} material${materials.length === 1 ? '' : 's'}`
              : 'Enrol to view materials'}
          </div>
        </div>
      </div>

      {enrolled ? (
        <CourseReader
          slug={slug}
          materials={materials}
          activeId={activeId}
          completedIds={completedIds}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Lock className="size-6" />
          </div>
          <h3 className="text-base font-semibold">Enrol to unlock this course</h3>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
            Get instant, free access to every lesson, note, and video.
          </p>
          <div className="mx-auto mt-6 max-w-xs">
            <EnrollButton courseId={course.id} slug={slug} />
          </div>
        </div>
      )}
    </div>
  )
}
