import Link from 'next/link'
import type { Metadata } from 'next'
import {
  FolderKanban,
  FileStack,
  Users,
  BookCheck,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getAdminStats } from '@/lib/queries'

export const metadata: Metadata = { title: 'Admin · Overview' }

export default async function AdminHome() {
  const stats = await getAdminStats()

  const cards = [
    { label: 'Total courses', value: stats.courses, icon: FolderKanban },
    { label: 'Published', value: stats.published, icon: BookCheck },
    { label: 'Materials', value: stats.materials, icon: FileStack },
    { label: 'Enrolments', value: stats.students, icon: Users },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your courses and content.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="size-4" /> New course
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <c.icon className="size-5" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {c.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/courses" className="group">
          <Card className="flex items-center justify-between p-6 transition-colors hover:border-primary/40">
            <div>
              <p className="font-medium">Manage courses</p>
              <p className="text-sm text-muted-foreground">
                Edit, publish, and reorder content.
              </p>
            </div>
            <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Card>
        </Link>
        <Link href="/admin/courses/new" className="group">
          <Card className="flex items-center justify-between p-6 transition-colors hover:border-primary/40">
            <div>
              <p className="font-medium">Create a course</p>
              <p className="text-sm text-muted-foreground">
                Add a new course from scratch.
              </p>
            </div>
            <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Card>
        </Link>
      </div>
    </div>
  )
}
