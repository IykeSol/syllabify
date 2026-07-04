'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { enrollInCourse } from '@/lib/actions'

export function EnrollButton({
  courseId,
  slug,
  enrolled,
}: {
  courseId: string
  slug: string
  enrolled?: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  if (enrolled) {
    return (
      <Button asChild variant="secondary" className="w-full">
        <Link href={`/courses/${slug}`}>
          Continue <ArrowRight className="size-4" />
        </Link>
      </Button>
    )
  }

  return (
    <Button
      className="w-full"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await enrollInCourse(courseId)
          if (res.error) {
            toast.error(res.error)
            return
          }
          toast.success('You are in! Opening your course…')
          router.push(`/courses/${slug}`)
          router.refresh()
        })
      }
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Enrol for free
    </Button>
  )
}
