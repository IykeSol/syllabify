import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  href = '/',
  showWordmark = true,
}: {
  className?: string
  href?: string
  showWordmark?: boolean
}) {
  return (
    <Link href={href} className={cn('inline-flex items-center gap-2', className)}>
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <GraduationCap className="size-5" />
      </span>
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight">Syllabify</span>
      )}
    </Link>
  )
}
