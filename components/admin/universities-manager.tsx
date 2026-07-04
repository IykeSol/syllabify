'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Plus, Search, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  saveUniversity,
  toggleUniversityActive,
  deleteUniversity,
  createDepartment,
  deleteDepartment,
} from '@/lib/actions'
import type { University, Department, UniversityOwnership } from '@/types/database'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

export function UniversitiesManager({
  universities,
  departments,
}: {
  universities: University[]
  departments: Department[]
}) {
  return (
    <Tabs defaultValue="universities">
      <TabsList>
        <TabsTrigger value="universities">
          Universities ({universities.length})
        </TabsTrigger>
        <TabsTrigger value="departments">
          Departments ({departments.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="universities" className="mt-4">
        <UniversitiesTab universities={universities} />
      </TabsContent>
      <TabsContent value="departments" className="mt-4">
        <DepartmentsTab departments={departments} />
      </TabsContent>
    </Tabs>
  )
}

// ---------------------------------------------------------------------
// Universities
// ---------------------------------------------------------------------

function UniversitiesTab({ universities }: { universities: University[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  // New-university dialog state
  const [name, setName] = useState('')
  const [abbreviation, setAbbreviation] = useState('')
  const [state, setState] = useState('')
  const [ownership, setOwnership] = useState<UniversityOwnership>('federal')
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return universities
    return universities.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.abbreviation?.toLowerCase().includes(q) ||
        u.state.toLowerCase().includes(q),
    )
  }, [universities, query])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await saveUniversity({ name, abbreviation, state, ownership })
    setSaving(false)
    if (res.error) {
      toast.error(res.error)
      return
    }
    toast.success('University added.')
    setAddOpen(false)
    setName('')
    setAbbreviation('')
    setState('')
    setOwnership('federal')
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, abbreviation, or state…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="size-4" /> Add university
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>University</TableHead>
              <TableHead className="hidden sm:table-cell">State</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Listed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No universities match “{query}”.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => <UniversityRow key={u.id} university={u} />)
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a university</DialogTitle>
            <DialogDescription>
              It becomes available immediately in course targeting and student
              filters.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="uni-name">Name</Label>
              <Input
                id="uni-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Caritas University"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="uni-abbr">Abbreviation</Label>
                <Input
                  id="uni-abbr"
                  value={abbreviation}
                  onChange={(e) => setAbbreviation(e.target.value)}
                  placeholder="e.g. CARITAS"
                />
              </div>
              <div className="grid gap-2">
                <Label>State</Label>
                <Select value={state} onValueChange={setState} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Ownership</Label>
              <Select
                value={ownership}
                onValueChange={(v) => setOwnership(v as UniversityOwnership)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="federal">Federal</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !state}>
                {saving && <Loader2 className="size-4 animate-spin" />}
                Add university
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function UniversityRow({ university }: { university: University }) {
  const router = useRouter()
  const [active, setActive] = useState(university.is_active)
  const [pending, startTransition] = useTransition()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function onToggle(value: boolean) {
    setActive(value)
    startTransition(async () => {
      const res = await toggleUniversityActive(university.id, value)
      if (res.error) {
        setActive(!value)
        toast.error(res.error)
      } else {
        toast.success(value ? 'University listed.' : 'University delisted.')
      }
    })
  }

  async function onDelete() {
    setDeleting(true)
    const res = await deleteUniversity(university.id)
    setDeleting(false)
    if (res.error) {
      toast.error(res.error)
      return
    }
    setConfirmOpen(false)
    toast.success('University deleted.')
    router.refresh()
  }

  return (
    <TableRow className={active ? undefined : 'opacity-60'}>
      <TableCell>
        <div className="font-medium">{university.name}</div>
        {university.abbreviation && (
          <div className="text-xs text-muted-foreground">
            {university.abbreviation}
          </div>
        )}
      </TableCell>
      <TableCell className="hidden sm:table-cell text-muted-foreground">
        {university.state}
      </TableCell>
      <TableCell className="hidden sm:table-cell capitalize text-muted-foreground">
        {university.ownership}
      </TableCell>
      <TableCell>
        {active ? (
          <Badge>Listed</Badge>
        ) : (
          <Badge variant="secondary">Delisted</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Switch
            checked={active}
            onCheckedChange={onToggle}
            disabled={pending}
            aria-label={`Toggle ${university.name} listing`}
          />
          <Button
            variant="ghost"
            size="icon"
            title="Delete"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete university?</DialogTitle>
              <DialogDescription>
                “{university.name}” will be removed permanently. Its courses
                stay, but fall back to “all universities”. To hide it
                temporarily, delist it instead.
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
      </TableCell>
    </TableRow>
  )
}

// ---------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------

function DepartmentsTab({ departments }: { departments: Department[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [faculty, setFaculty] = useState('')
  const [saving, setSaving] = useState(false)

  const faculties = useMemo(
    () =>
      Array.from(
        new Set(departments.map((d) => d.faculty).filter((f): f is string => !!f)),
      ).sort(),
    [departments],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return departments
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(q) || d.faculty?.toLowerCase().includes(q),
    )
  }, [departments, query])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await createDepartment(name, faculty)
    setSaving(false)
    if (res.error) {
      toast.error(res.error)
      return
    }
    toast.success('Department added.')
    setAddOpen(false)
    setName('')
    setFaculty('')
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by department or faculty…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="size-4" /> Add department
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead className="hidden sm:table-cell">Faculty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                  No departments match “{query}”.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((d) => <DepartmentRow key={d.id} department={d} />)
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a department</DialogTitle>
            <DialogDescription>
              A degree programme courses can target, e.g. Computer Science.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dept-name">Name</Label>
              <Input
                id="dept-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Computer Science"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Faculty</Label>
              <Select value={faculty} onValueChange={setFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a faculty (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="size-4 animate-spin" />}
                Add department
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DepartmentRow({ department }: { department: Department }) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function onDelete() {
    setDeleting(true)
    const res = await deleteDepartment(department.id)
    setDeleting(false)
    if (res.error) {
      toast.error(res.error)
      return
    }
    setConfirmOpen(false)
    toast.success('Department deleted.')
    router.refresh()
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{department.name}</TableCell>
      <TableCell className="hidden sm:table-cell text-muted-foreground">
        {department.faculty ?? 'Not set'}
      </TableCell>
      <TableCell className="text-right">
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
              <DialogTitle>Delete department?</DialogTitle>
              <DialogDescription>
                “{department.name}” will be removed. Courses that pointed to it
                fall back to “all departments”.
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
      </TableCell>
    </TableRow>
  )
}
