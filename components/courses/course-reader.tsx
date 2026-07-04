import Link from 'next/link'
import { FileText, Video, StickyNote, CheckCircle2, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdSlot } from '@/components/ads/ad-slot'
import { MaterialViewer } from '@/components/courses/material-viewer'
import { EmptyState } from '@/components/empty-state'
import type { Material, MaterialType } from '@/types/database'

const typeIcon: Record<MaterialType, typeof FileText> = {
  pdf: FileText,
  video: Video,
  note: StickyNote,
}

export function CourseReader({
  slug,
  materials,
  activeId,
  completedIds,
}: {
  slug: string
  materials: Material[]
  activeId?: string
  completedIds: Set<string>
}) {
  const active = materials.find((m) => m.id === activeId) ?? null

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold">
            Course content
          </div>
          {materials.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              No materials published yet.
            </p>
          ) : (
            <ol className="p-2">
              {materials.map((m) => {
                const Icon = typeIcon[m.type ?? 'note']
                const done = completedIds.has(m.id)
                const isActive = m.id === activeId
                return (
                  <li key={m.id}>
                    <Link
                      href={`/courses/${slug}/${m.id}`}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted',
                      )}
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                        <Icon className="size-3.5" />
                      </span>
                      <span className="line-clamp-1 flex-1">{m.title}</span>
                      {done && (
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
        <AdSlot
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_DETAIL}
          className="min-h-40"
        />
      </aside>

      <div className="min-w-0">
        {active ? (
          <MaterialViewer material={active} />
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Select a material"
            description="Choose a lesson from the list to start learning."
          />
        )}
      </div>
    </div>
  )
}
