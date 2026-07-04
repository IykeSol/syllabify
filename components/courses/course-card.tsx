import Link from 'next/link'
import { BookOpen, FileText, CheckCircle2, School, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { CourseCard as CourseCardType } from '@/lib/queries'
import type { CourseKind } from '@/types/database'

const kindLabels: Record<CourseKind, string | null> = {
  university: null, // the school chip below already says it
  digital_skill: 'Digital skill',
  graduate_brochure: 'Trainee brochure',
}

/** "200L · First semester" — whichever parts are set. */
function levelSemesterLabel(level: number | null, semester: number | null) {
  const parts: string[] = []
  if (level) parts.push(`${level}L`)
  if (semester) parts.push(semester === 1 ? 'First semester' : 'Second semester')
  return parts.join(' · ')
}

export function CourseCard({
  course,
  href,
  footer,
  progress,
}: {
  course: CourseCardType
  href: string
  footer?: React.ReactNode
  progress?: number
}) {
  const materialCount = course.materials?.[0]?.count ?? 0

  return (
    <Card className="group flex flex-col overflow-hidden p-0 transition-shadow hover:shadow-md">
      <Link href={href} className="block" aria-label={course.title}>
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          {course.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnail_url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-transparent text-primary">
              <BookOpen className="size-10 opacity-40" />
            </div>
          )}
          {course.categories && (
            <Badge
              variant="secondary"
              className="absolute left-3 top-3 bg-background/90 backdrop-blur"
            >
              {course.categories.name}
            </Badge>
          )}
          {course.is_general ? (
            <Badge className="absolute right-3 top-3 bg-amber-500/90 text-white backdrop-blur">
              General
            </Badge>
          ) : (
            kindLabels[course.kind] && (
              <Badge className="absolute right-3 top-3 bg-primary/90 backdrop-blur">
                {kindLabels[course.kind]}
              </Badge>
            )
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={href}>
          <h3 className="line-clamp-1 font-semibold tracking-tight transition-colors group-hover:text-primary">
            {course.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {course.description || 'No description yet.'}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-3.5" />
            {materialCount} material{materialCount === 1 ? '' : 's'}
          </span>
          {(course.universities || course.departments) && (
            <span className="inline-flex items-center gap-1.5">
              <School className="size-3.5" />
              {[
                course.universities?.abbreviation ?? course.universities?.name,
                course.is_general ? 'All departments' : course.departments?.name,
              ]
                .filter(Boolean)
                .join(' · ')}
            </span>
          )}
          {levelSemesterLabel(course.level, course.semester) && (
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="size-3.5" />
              {levelSemesterLabel(course.level, course.semester)}
            </span>
          )}
        </div>

        {typeof progress === 'number' && (
          <div className="mt-3">
            <Progress value={progress} className="h-1.5" />
            {progress >= 100 ? (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="size-3.5" /> Completed
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-muted-foreground">{progress}% complete</p>
            )}
          </div>
        )}

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </Card>
  )
}
