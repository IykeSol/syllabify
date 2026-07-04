import { notFound } from 'next/navigation'
import { CourseDetail } from '@/components/courses/course-detail'
import {
  getCourseBySlug,
  getCurrentUser,
  isEnrolled,
  getProgressForUser,
} from '@/lib/queries'

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ slug: string; materialId: string }>
}) {
  const { slug, materialId } = await params
  // Course lookup and the user check are independent — fetch them together.
  const [data, user] = await Promise.all([getCourseBySlug(slug), getCurrentUser()])
  if (!data) notFound()

  // Enrollment + progress both depend on the user but not on each other.
  const [enrolled, progress] = user
    ? await Promise.all([
        isEnrolled(user.id, data.course.id),
        getProgressForUser(user.id),
      ])
    : [false, []]
  const completedIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.material_id as string),
  )

  return (
    <CourseDetail
      course={data.course}
      materials={data.materials}
      enrolled={enrolled}
      slug={slug}
      activeId={materialId}
      completedIds={completedIds}
    />
  )
}
