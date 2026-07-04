import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { MaterialsManager } from '@/components/admin/materials-manager'
import { getCourseByIdAdmin, getMaterialsAdmin } from '@/lib/queries'

export const metadata: Metadata = { title: 'Admin · Materials' }

export default async function MaterialsPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = await getCourseByIdAdmin(courseId)
  if (!course) notFound()

  const materials = await getMaterialsAdmin(courseId)

  return (
    <div className="space-y-6">
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Courses
      </Link>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{course.title}</h1>
        <p className="mt-1 text-muted-foreground">
          Add and organise this course&apos;s materials.
        </p>
      </div>
      <MaterialsManager courseId={courseId} initialMaterials={materials} />
    </div>
  )
}
