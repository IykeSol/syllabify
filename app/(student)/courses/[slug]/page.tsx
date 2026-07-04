import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CourseDetail } from '@/components/courses/course-detail'
import {
  getCourseBySlug,
  getCurrentUser,
  isEnrolled,
  getProgressForUser,
} from '@/lib/queries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await getCourseBySlug(slug)
  return { title: data?.course.title ?? 'Course' }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getCourseBySlug(slug)
  if (!data) notFound()

  const user = await getCurrentUser()
  const enrolled = user ? await isEnrolled(user.id, data.course.id) : false
  const progress = user ? await getProgressForUser(user.id) : []
  const completedIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.material_id as string),
  )

  return (
    <CourseDetail
      course={data.course}
      materials={data.materials}
      enrolled={enrolled}
      slug={slug}
      completedIds={completedIds}
    />
  )
}
