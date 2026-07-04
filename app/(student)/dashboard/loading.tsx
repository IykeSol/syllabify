import { Skeleton } from '@/components/ui/skeleton'
import { CourseGridSkeleton } from '@/components/courses/course-card-skeleton'

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <CourseGridSkeleton count={3} />
    </div>
  )
}
