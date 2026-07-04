'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  FileText,
  Video,
  StickyNote,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  FileStack,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { CloudinaryUpload } from '@/components/admin/cloudinary-upload'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { EmptyState } from '@/components/empty-state'
import { cn } from '@/lib/utils'
import { saveMaterial, deleteMaterial, reorderMaterials } from '@/lib/actions'
import type { Material, MaterialType } from '@/types/database'

const typeMeta: Record<MaterialType, { icon: typeof FileText; label: string }> = {
  pdf: { icon: FileText, label: 'PDF' },
  video: { icon: Video, label: 'Video' },
  note: { icon: StickyNote, label: 'Note' },
}

function SortableItem({
  material,
  onEdit,
  onDelete,
}: {
  material: Material
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: material.id })
  const Icon = typeMeta[material.type ?? 'note'].icon

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5',
        isDragging && 'z-10 shadow-lg',
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{material.title}</p>
        <p className="text-xs text-muted-foreground">
          {typeMeta[material.type ?? 'note'].label}
          {!material.is_published && ' · Draft'}
        </p>
      </div>
      <Button variant="ghost" size="icon" onClick={onEdit} title="Edit">
        <Pencil className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        title="Delete"
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}

export function MaterialsManager({
  courseId,
  initialMaterials,
}: {
  courseId: string
  initialMaterials: Material[]
}) {
  const router = useRouter()
  const [items, setItems] = useState(initialMaterials)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Material | null>(null)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [title, setTitle] = useState('')
  const [type, setType] = useState<MaterialType>('pdf')
  const [content, setContent] = useState('')
  const [publicId, setPublicId] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [published, setPublished] = useState(true)

  // Keep local list in sync with refreshed server data
  useEffect(() => setItems(initialMaterials), [initialMaterials])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function resetForm() {
    setTitle('')
    setType('pdf')
    setContent('')
    setPublicId(null)
    setUrl(null)
    setPublished(true)
  }

  function openNew() {
    setEditing(null)
    resetForm()
    setOpen(true)
  }

  function openEdit(m: Material) {
    setEditing(m)
    setTitle(m.title)
    setType(m.type ?? 'pdf')
    setContent(m.content ?? '')
    setPublicId(m.cloudinary_public_id)
    setUrl(m.cloudinary_url)
    setPublished(m.is_published)
    setOpen(true)
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const next = arrayMove(items, oldIndex, newIndex)
    setItems(next)
    const res = await reorderMaterials(
      courseId,
      next.map((i) => i.id),
    )
    if (res.error) toast.error(res.error)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return toast.error('A title is required.')
    if (type !== 'note' && !publicId && !url) {
      return toast.error('Please upload a file first.')
    }
    setSaving(true)
    const res = await saveMaterial({
      id: editing?.id,
      course_id: courseId,
      title,
      type,
      cloudinary_public_id: type === 'note' ? null : publicId,
      cloudinary_url: type === 'note' ? null : url,
      content: type === 'note' ? content : null,
      order_index: editing?.order_index ?? items.length,
      is_published: published,
    })
    setSaving(false)
    if (res.error) return toast.error(res.error)
    toast.success(editing ? 'Material updated.' : 'Material added.')
    setOpen(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
    const res = await deleteMaterial(id, courseId)
    if (res.error) {
      toast.error(res.error)
      router.refresh()
    } else {
      toast.success('Material deleted.')
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} material{items.length === 1 ? '' : 's'} · drag to reorder
        </p>
        <Button onClick={openNew}>
          <Plus className="size-4" /> Add material
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={FileStack}
          title="No materials yet"
          description="Add a PDF, video, or note to build out this course."
          action={
            <Button onClick={openNew}>
              <Plus className="size-4" /> Add the first material
            </Button>
          }
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="grid gap-2">
              {items.map((m) => (
                <SortableItem
                  key={m.id}
                  material={m}
                  onEdit={() => openEdit(m)}
                  onDelete={() => handleDelete(m.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit material' : 'Add material'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="m-title">Title</Label>
              <Input
                id="m-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Week 1: Getting started"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as MaterialType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === 'note' ? (
              <div className="grid gap-2">
                <Label>Content</Label>
                <RichTextEditor value={content} onChange={setContent} />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label>{type === 'pdf' ? 'PDF file' : 'Video file'}</Label>
                <CloudinaryUpload
                  resourceType={type === 'pdf' ? 'image' : 'video'}
                  accept={type === 'pdf' ? 'application/pdf' : 'video/*'}
                  label={`Upload ${type === 'pdf' ? 'a PDF' : 'a video'}`}
                  value={publicId || url}
                  onUploaded={(r) => {
                    setPublicId(r.publicId)
                    setUrl(r.url)
                  }}
                  onClear={() => {
                    setPublicId(null)
                    setUrl(null)
                  }}
                />
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-xs text-muted-foreground">
                  Visible to enrolled students.
                </p>
              </div>
              <Switch checked={published} onCheckedChange={setPublished} />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="size-4 animate-spin" />}
                {editing ? 'Save changes' : 'Add material'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
