import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CourseForm } from '@/components/admin/course-form'
import { MaterialsManager } from '@/components/admin/materials-manager'
import {
  getCourseByIdAdmin,
  getCategories,
  getMaterialsAdmin,
  getActiveUniversities,
  getDepartments,
} from '@/lib/queries'

export const metadata: Metadata = { title: 'Admin · Edit course' }

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [course, categories, materials, universities, departments] =
    await Promise.all([
      getCourseByIdAdmin(id),
      getCategories(),
      getMaterialsAdmin(id),
      getActiveUniversities(),
      getDepartments(),
    ])
  if (!course) notFound()

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit course</h1>
        <p className="mt-1 text-muted-foreground">
          Update the details, or scroll down to manage its materials.
        </p>
      </div>
      <CourseForm
        categories={categories}
        universities={universities}
        departments={departments}
        course={course}
      />

      <div
        id="materials"
        className="scroll-mt-24 rounded-xl border border-border bg-card p-6"
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Materials</h2>
          <p className="text-sm text-muted-foreground">
            The PDFs, videos, and notes students work through, in order.
          </p>
        </div>
        <MaterialsManager courseId={id} initialMaterials={materials} />
      </div>
    </div>
  )
}
