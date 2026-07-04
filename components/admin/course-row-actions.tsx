'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Pencil, Trash2, Files, Loader2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toggleCoursePublished, deleteCourse } from '@/lib/actions'

export function CourseRowActions({
  id,
  title,
  isPublished,
}: {
  id: string
  title: string
  isPublished: boolean
}) {
  const router = useRouter()
  const [published, setPublished] = useState(isPublished)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [deleting, setDeleting] = useState(false)

  function onToggle(value: boolean) {
    setPublished(value)
    startTransition(async () => {
      const res = await toggleCoursePublished(id, value)
      if (res.error) {
        setPublished(!value)
        toast.error(res.error)
      } else {
        toast.success(value ? 'Course published.' : 'Course unpublished.')
      }
    })
  }

  async function onDelete() {
    setDeleting(true)
    const res = await deleteCourse(id)
    setDeleting(false)
    if (res.error) {
      toast.error(res.error)
      return
    }
    setConfirmOpen(false)
    toast.success('Course deleted.')
    router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Switch
        checked={published}
        onCheckedChange={onToggle}
        disabled={pending}
        aria-label="Toggle published"
      />
      <Button asChild variant="ghost" size="icon" title="Materials">
        <Link href={`/admin/materials/${id}`}>
          <Files className="size-4" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" title="Edit">
        <Link href={`/admin/courses/${id}/edit`}>
          <Pencil className="size-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Delete"
        className="text-muted-foreground hover:text-destructive"
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2 className="size-4" />
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete course?</DialogTitle>
            <DialogDescription>
              “{title}” and all of its materials will be permanently removed.
              This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={deleting}>
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
