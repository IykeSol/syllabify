'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Plus, Check, X, BookOpen, Users, ImageIcon, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CloudinaryUpload } from '@/components/admin/cloudinary-upload'
import { saveCourse, createCategory } from '@/lib/actions'
import { slugify } from '@/lib/constants'
import type {
  Category,
  Course,
  CourseKind,
  CourseLevel,
  CourseSemester,
  University,
  Department,
} from '@/types/database'

// Radix Select can't hold an empty value, so "applies to all" uses a sentinel.
const ALL = 'all'
const LEVELS: CourseLevel[] = [100, 200, 300, 400, 500, 600]
const SEMESTERS: { value: CourseSemester; label: string }[] = [
  { value: 1, label: 'First semester' },
  { value: 2, label: 'Second semester' },
]

/** Card section with an icon, a title, and a one-line hint. */
function Section({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: typeof BookOpen
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <Card className="gap-0 p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </span>
        <div>
          <h2 className="font-semibold leading-tight tracking-tight">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p>
        </div>
      </div>
      <div className="grid gap-5">{children}</div>
    </Card>
  )
}

export function CourseForm({
  categories: initialCategories,
  universities,
  departments,
  course,
}: {
  categories: Category[]
  universities: University[]
  departments: Department[]
  course?: Course | null
}) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [title, setTitle] = useState(course?.title ?? '')
  const [description, setDescription] = useState(course?.description ?? '')
  const [categoryId, setCategoryId] = useState(course?.category_id ?? '')
  const [universityId, setUniversityId] = useState(course?.university_id ?? ALL)
  const [departmentId, setDepartmentId] = useState(course?.department_id ?? ALL)
  const [thumbnail, setThumbnail] = useState(course?.thumbnail_url ?? '')
  const [published, setPublished] = useState(course?.is_published ?? false)
  const [kind, setKind] = useState<CourseKind>(course?.kind ?? 'university')
  const [level, setLevel] = useState<string>(course?.level ? String(course.level) : ALL)
  const [semester, setSemester] = useState<string>(
    course?.semester ? String(course.semester) : ALL,
  )
  const [isGeneral, setIsGeneral] = useState(course?.is_general ?? false)
  const [saving, setSaving] = useState(false)

  const [addingCat, setAddingCat] = useState(false)
  const [newCat, setNewCat] = useState('')
  const [creatingCat, setCreatingCat] = useState(false)

  async function handleCreateCategory() {
    if (!newCat.trim()) return
    setCreatingCat(true)
    const res = await createCategory(newCat)
    setCreatingCat(false)
    if (res.error || !res.id) {
      toast.error(res.error || 'Could not create that category. Try again.')
      return
    }
    const created: Category = {
      id: res.id,
      name: newCat.trim(),
      slug: slugify(newCat),
      description: null,
      created_at: new Date().toISOString(),
    }
    setCategories((c) => [...c, created])
    setCategoryId(res.id)
    setNewCat('')
    setAddingCat(false)
    toast.success('Category created.')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Give the course a title first.')
      return
    }
    setSaving(true)
    const res = await saveCourse({
      id: course?.id,
      title,
      description,
      category_id: categoryId || null,
      university_id: universityId === ALL ? null : universityId,
      department_id: departmentId === ALL ? null : departmentId,
      level: level === ALL ? null : (Number(level) as CourseLevel),
      semester: semester === ALL ? null : (Number(semester) as CourseSemester),
      is_general: isGeneral,
      thumbnail_url: thumbnail || null,
      kind,
      is_published: published,
    })
    setSaving(false)
    if (res.error) {
      toast.error(res.error)
      return
    }
    // saveCourse already revalidates these paths, so the destination renders
    // fresh on navigation. Don't call router.refresh() here: firing it right
    // after a push to another route races the navigation and can swallow the
    // first click (you'd have to click twice).
    if (!course && res.id) {
      // New course: land on its edit page, scrolled to the materials section.
      toast.success('Course created. Now add your materials below.')
      router.push(`/admin/courses/${res.id}/edit#materials`)
    } else {
      toast.success('Course updated.')
      router.push('/admin/courses')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid items-start gap-6 lg:grid-cols-[1fr_340px]"
    >
      {/* Main column */}
      <div className="grid gap-6">
        <Section
          icon={BookOpen}
          title="Course details"
          hint="The name and summary students will see in the catalogue."
        >
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CSC 201: Computer Programming I"
              required
            />
            {title && (
              <p className="text-xs text-muted-foreground">
                Web address: <span className="font-mono">/{slugify(title)}</span>
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Two or three sentences on what this covers and why it matters."
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            {addingCat ? (
              <div className="flex items-center gap-2">
                <Input
                  autoFocus
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  placeholder="Name the new category"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreateCategory()
                    }
                  }}
                />
                <Button type="button" size="icon" onClick={handleCreateCategory} disabled={creatingCat}>
                  {creatingCat ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => setAddingCat(false)}>
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" onClick={() => setAddingCat(true)}>
                  <Plus className="size-4" /> New
                </Button>
              </div>
            )}
          </div>
        </Section>

        <Section
          icon={Users}
          title="Who it's for"
          hint="Students see university courses, graduates see trainee brochures, and digital skills are open to both."
        >
          <div className="grid gap-2">
            <Label>Course type</Label>
            <Select value={kind} onValueChange={(v) => setKind(v as CourseKind)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="university">
                  University course (students only)
                </SelectItem>
                <SelectItem value="digital_skill">
                  Digital skill (open to everyone)
                </SelectItem>
                <SelectItem value="graduate_brochure">
                  Graduate trainee brochure (graduates only)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {kind === 'university' && (
            <>
              <div className="grid gap-2">
                <Label>University</Label>
                <Select value={universityId} onValueChange={setUniversityId}>
                  <SelectTrigger>
                    <SelectValue placeholder="All universities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All universities</SelectItem>
                    {universities.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                        {u.abbreviation ? ` (${u.abbreviation})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Most course material follows the national curriculum, so
                  &ldquo;All universities&rdquo; is usually right. Pick one
                  school only when the content is specific to it.
                </p>
              </div>

              {/* General studies toggle: shared across every department. */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                <div className="pr-4">
                  <p className="text-sm font-medium">General studies course</p>
                  <p className="text-xs text-muted-foreground">
                    For year-one courses every department takes together, like
                    Use of English or Entrepreneurship. Set it once instead of
                    repeating it under each department.
                  </p>
                </div>
                <Switch checked={isGeneral} onCheckedChange={setIsGeneral} />
              </div>

              {!isGeneral && (
                <div className="grid gap-2">
                  <Label>Department</Label>
                  <Select value={departmentId} onValueChange={setDepartmentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>All departments</SelectItem>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                          {d.faculty ? ` · ${d.faculty}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Level</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>Any level</SelectItem>
                      {LEVELS.map((l) => (
                        <SelectItem key={l} value={String(l)}>
                          {l} level
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Semester</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>Any semester</SelectItem>
                      {SEMESTERS.map((s) => (
                        <SelectItem key={s.value} value={String(s.value)}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </Section>
      </div>

      {/* Side rail */}
      <div className="grid gap-6 lg:sticky lg:top-24">
        <Section
          icon={ImageIcon}
          title="Cover image"
          hint="Shown on the course card in the catalogue."
        >
          <CloudinaryUpload
            resourceType="image"
            accept="image/*"
            label="Upload a cover image"
            hint="PNG or JPG. Wide images (16:9) look best."
            value={thumbnail}
            onUploaded={(r) => setThumbnail(r.url)}
            onClear={() => setThumbnail('')}
          />
        </Section>

        <Section
          icon={Eye}
          title="Visibility"
          hint="Drafts stay hidden until you publish."
        >
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium">
                {published ? 'Published' : 'Draft'}
              </p>
              <p className="text-xs text-muted-foreground">
                {published
                  ? 'Students can see and enrol in this course.'
                  : 'Only you can see this course right now.'}
              </p>
            </div>
            <Switch checked={published} onCheckedChange={setPublished} />
          </div>

          <div className="grid gap-2">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {course ? 'Save changes' : 'Create course'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </Section>
      </div>
    </form>
  )
}
