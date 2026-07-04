'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { GraduationCap, BriefcaseBusiness, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { setProfileTrack } from '@/lib/actions'
import type { LearnerTrack } from '@/types/database'

/**
 * Shown on the dashboard until the learner picks a track (OAuth signups
 * skip the signup form, so they land here without one). The track decides
 * what they can enrol in: students get university courses + digital skills,
 * graduates get trainee brochures + digital skills.
 */
export function TrackPrompt() {
  const router = useRouter()
  const [saving, setSaving] = useState<LearnerTrack | null>(null)

  async function choose(track: LearnerTrack) {
    setSaving(track)
    const res = await setProfileTrack(track)
    setSaving(null)
    if (res.error) {
      toast.error(res.error)
      return
    }
    toast.success(
      track === 'student'
        ? 'Welcome! Your catalogue now shows university courses and digital skills.'
        : 'Welcome! Your catalogue now shows trainee brochures and digital skills.',
    )
    router.refresh()
  }

  return (
    <Card className="border-primary/30 bg-primary/5 p-6">
      <h2 className="text-lg font-semibold tracking-tight">
        One quick thing: where are you on your journey?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This decides what you see: students get university course materials,
        fresh graduates get trainee brochures. Everyone gets digital skills.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => choose('student')}
          disabled={saving !== null}
          className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            {saving === 'student' ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <GraduationCap className="size-5" />
            )}
          </span>
          <span>
            <span className="block font-medium">I&apos;m a university student</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Course materials for your school & department, plus digital skills
            </span>
          </span>
        </button>
        <button
          onClick={() => choose('graduate')}
          disabled={saving !== null}
          className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            {saving === 'graduate' ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <BriefcaseBusiness className="size-5" />
            )}
          </span>
          <span>
            <span className="block font-medium">I&apos;m a fresh graduate</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Graduate trainee brochures & interview prep, plus digital skills
            </span>
          </span>
        </button>
      </div>
    </Card>
  )
}
