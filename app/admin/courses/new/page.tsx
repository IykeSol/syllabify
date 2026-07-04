import type { Metadata } from 'next'
import { CourseForm } from '@/components/admin/course-form'
import {
  getCategories,
  getActiveUniversities,
  getDepartments,
} from '@/lib/queries'

export const metadata: Metadata = { title: 'Admin · New course' }

export default async function NewCoursePage() {
  const [categories, universities, departments] = await Promise.all([
    getCategories(),
    getActiveUniversities(),
    getDepartments(),
  ])

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New course</h1>
        <p className="mt-1 text-muted-foreground">
          Set the details, choose who it&apos;s for, then add materials on the
          next screen.
        </p>
      </div>
      <CourseForm
        categories={categories}
        universities={universities}
        departments={departments}
      />
    </div>
  )
}
