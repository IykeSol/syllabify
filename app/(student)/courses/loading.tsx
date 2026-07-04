import { Skeleton } from '@/components/ui/skeleton'
import { CourseGridSkeleton } from '@/components/courses/course-card-skeleton'

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-10 w-full" />
      <CourseGridSkeleton />
    </div>
  )
}
