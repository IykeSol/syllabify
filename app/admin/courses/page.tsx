import Link from 'next/link'
import type { Metadata } from 'next'
import { Plus, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/empty-state'
import { CourseRowActions } from '@/components/admin/course-row-actions'
import { getAllCoursesAdmin } from '@/lib/queries'

export const metadata: Metadata = { title: 'Admin · Courses' }

export default async function AdminCoursesPage() {
  const courses = await getAllCoursesAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
          <p className="mt-1 text-muted-foreground">
            {courses.length} course{courses.length === 1 ? '' : 's'} total.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="size-4" /> New course
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No courses yet"
          description="Create your first course to start adding materials."
          action={
            <Button asChild>
              <Link href="/admin/courses/new">
                <Plus className="size-4" /> New course
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Materials</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-muted-foreground">/{c.slug}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {c.categories?.name ?? 'None'}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {c.materials?.[0]?.count ?? 0}
                  </TableCell>
                  <TableCell>
                    {c.is_published ? (
                      <Badge>Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <CourseRowActions
                      id={c.id}
                      title={c.title}
                      isPublished={c.is_published}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
