'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Category, University, Department, LearnerTrack } from '@/types/database'

const kindOptions: Record<string, { value: string; label: string }[]> = {
  student: [
    { value: 'university', label: 'University courses' },
    { value: 'digital_skill', label: 'Digital skills' },
  ],
  graduate: [
    { value: 'graduate_brochure', label: 'Trainee brochures' },
    { value: 'digital_skill', label: 'Digital skills' },
  ],
  all: [
    { value: 'university', label: 'University courses' },
    { value: 'digital_skill', label: 'Digital skills' },
    { value: 'graduate_brochure', label: 'Trainee brochures' },
  ],
}

export function CourseFilters({
  categories,
  universities,
  departments,
  track,
}: {
  categories: Category[]
  universities: University[]
  departments: Department[]
  track?: LearnerTrack | null
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const category = params.get('category') ?? 'all'
  const kind = params.get('kind') ?? 'all'
  const university = params.get('university') ?? 'all'
  const department = params.get('department') ?? 'all'
  const level = params.get('level') ?? 'all'
  const semester = params.get('semester') ?? 'all'

  const kinds = kindOptions[track ?? 'all'] ?? kindOptions.all
  // Graduates never browse university courses, so school filters are noise.
  const showUniversityFilters =
    track !== 'graduate' && kind !== 'digital_skill' && kind !== 'graduate_brochure'

  // Debounced search → URL
  useEffect(() => {
    const handle = setTimeout(() => {
      const sp = new URLSearchParams(Array.from(params.entries()))
      if (q.trim()) sp.set('q', q.trim())
      else sp.delete('q')
      router.replace(`${pathname}${sp.toString() ? `?${sp}` : ''}`)
    }, 350)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  /** Set or clear one filter param on /courses. */
  function onFilter(key: string, value: string) {
    const sp = new URLSearchParams(Array.from(params.entries()))
    if (value === 'all') sp.delete(key)
    else sp.set(key, value)
    router.replace(`${pathname}${sp.toString() ? `?${sp}` : ''}`)
  }

  return (
    <div className="space-y-3">
      {/* Mobile: search takes its own line, filter pills wrap side by side.
          Desktop (sm+): one row, unchanged. */}
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
        <div className="relative w-full sm:w-auto sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses…"
            className="pl-9"
          />
        </div>
        <Select value={kind} onValueChange={(v) => onFilter('kind', v)}>
          <SelectTrigger className="sm:w-52">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {kinds.map((k) => (
              <SelectItem key={k.value} value={k.value}>
                {k.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={(v) => onFilter('category', v)}>
          <SelectTrigger className="sm:w-52">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {showUniversityFilters && (
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
          <Select value={university} onValueChange={(v) => onFilter('university', v)}>
            <SelectTrigger className="sm:flex-1">
              <SelectValue placeholder="All universities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All universities</SelectItem>
              {universities.map((u) => (
                <SelectItem key={u.id} value={u.slug}>
                  {u.name}
                  {u.abbreviation ? ` (${u.abbreviation})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={department} onValueChange={(v) => onFilter('department', v)}>
            <SelectTrigger className="sm:flex-1">
              <SelectValue placeholder="All departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.slug}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={(v) => onFilter('level', v)}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {[100, 200, 300, 400, 500, 600].map((l) => (
                <SelectItem key={l} value={String(l)}>
                  {l} level
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={semester} onValueChange={(v) => onFilter('semester', v)}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="All semesters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All semesters</SelectItem>
              <SelectItem value="1">First semester</SelectItem>
              <SelectItem value="2">Second semester</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
