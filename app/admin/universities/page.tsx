import type { Metadata } from 'next'
import { UniversitiesManager } from '@/components/admin/universities-manager'
import { getAllUniversitiesAdmin, getDepartments } from '@/lib/queries'

export const metadata: Metadata = { title: 'Admin · Universities' }

export default async function AdminUniversitiesPage() {
  const [universities, departments] = await Promise.all([
    getAllUniversitiesAdmin(),
    getDepartments(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Universities</h1>
        <p className="mt-1 text-muted-foreground">
          The schools and departments courses can target. Delisted universities
          disappear from student filters but keep their courses.
        </p>
      </div>
      <UniversitiesManager universities={universities} departments={departments} />
    </div>
  )
}
