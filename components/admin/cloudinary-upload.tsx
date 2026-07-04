'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { UploadCloud, Loader2, FileCheck2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export type UploadResult = {
  publicId: string
  url: string
  resourceType: string
}

export function CloudinaryUpload({
  label = 'Click to upload or drag a file here',
  hint,
  accept,
  resourceType = 'auto',
  value,
  onUploaded,
  onClear,
}: {
  label?: string
  hint?: string
  accept?: string
  resourceType?: 'image' | 'video' | 'raw' | 'auto'
  value?: string | null
  onUploaded: (r: UploadResult) => void
  onClear?: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)

  async function upload(file: File) {
    setUploading(true)
    setProgress(0)
    try {
      const signRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceType }),
      })
      if (!signRes.ok) throw new Error('Not authorised to upload.')
      const { timestamp, signature, apiKey, cloudName, folder } = await signRes.json()

      const form = new FormData()
      form.append('file', file)
      form.append('api_key', apiKey)
      form.append('timestamp', String(timestamp))
      form.append('signature', signature)
      form.append('folder', folder)

      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`
      const result = await new Promise<{
        public_id: string
        secure_url: string
        resource_type: string
      }>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', endpoint)
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
        }
        xhr.onload = () =>
          xhr.status < 300
            ? resolve(JSON.parse(xhr.responseText))
            : reject(new Error('Upload failed.'))
        xhr.onerror = () => reject(new Error('Upload failed.'))
        xhr.send(form)
      })

      onUploaded({
        publicId: result.public_id,
        url: result.secure_url,
        resourceType: result.resource_type,
      })
      toast.success('Upload complete.')
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  if (value && !uploading) {
    // Show an image preview for thumbnails; a filename chip for PDFs/videos.
    const isImagePreview = accept?.startsWith('image/') && /^https?:\/\//.test(value)
    if (isImagePreview) {
      return (
        <div className="group relative overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded preview" className="aspect-video w-full object-cover" />
          {onClear && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={onClear}
              className="absolute right-2 top-2 size-8 shadow-sm"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      )
    }
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <FileCheck2 className="size-5 shrink-0 text-emerald-500" />
          <span className="truncate text-sm text-muted-foreground">{value}</span>
        </div>
        {onClear && (
          <Button type="button" variant="ghost" size="icon" onClick={onClear}>
            <X className="size-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file) upload(file)
      }}
      onClick={() => !uploading && inputRef.current?.click()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-8 text-center transition-colors',
        dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/40',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) upload(file)
        }}
      />
      {uploading ? (
        <>
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Uploading… {progress}%</p>
          <Progress value={progress} className="mt-1 h-1.5 w-40" />
        </>
      ) : (
        <>
          <div className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
            <UploadCloud className="size-5" />
          </div>
          <p className="text-sm font-medium">{label}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </>
      )}
    </div>
  )
}
