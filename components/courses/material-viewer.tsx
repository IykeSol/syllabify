'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { pdfPageImageUrl, videoUrl } from '@/lib/cloudinary-client'
import { sanitize } from '@/lib/sanitize'
import { markMaterialComplete, getPdfPageCount } from '@/lib/actions'
import type { Material } from '@/types/database'

/**
 * View-only PDF reader: each page is delivered as a watermarked image and
 * shown as an <img> we control — so there is no native PDF viewer and thus
 * no Save/Print toolbar or right-click menu. Selection and drag are disabled.
 * (Not screenshot-proof — nothing browser-rendered ever is — but it removes
 * the casual download/print paths.)
 */
function PdfPages({ publicId }: { publicId: string }) {
  const [pages, setPages] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    getPdfPageCount(publicId)
      .then((n) => active && setPages(n))
      .catch(() => active && setPages(1))
    return () => {
      active = false
    }
  }, [publicId])

  if (pages === null) {
    return (
      <div className="grid h-[60vh] place-items-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  return (
    <div
      className="max-h-[80vh] select-none space-y-4 overflow-y-auto rounded-lg bg-muted/40 p-3"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={p}
          src={pdfPageImageUrl(publicId, p)}
          alt={`Page ${p}`}
          draggable={false}
          className="mx-auto block w-full max-w-3xl rounded shadow-sm"
        />
      ))}
    </div>
  )
}

export function MaterialViewer({ material }: { material: Material }) {
  // Auto-mark as complete when the student opens the material.
  useEffect(() => {
    markMaterialComplete(material.id).catch(() => {})
  }, [material.id])

  const videoSrc = material.cloudinary_public_id
    ? videoUrl(material.cloudinary_public_id)
    : material.cloudinary_url ?? ''

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h2 className="font-semibold tracking-tight">{material.title}</h2>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {material.type}
        </span>
      </header>

      <div className="p-2 sm:p-4">
        {material.type === 'pdf' &&
          (material.cloudinary_public_id ? (
            <PdfPages publicId={material.cloudinary_public_id} />
          ) : (
            <div className="grid h-[40vh] place-items-center text-sm text-muted-foreground">
              This PDF is unavailable.
            </div>
          ))}

        {material.type === 'video' && (
          <div
            className="relative select-none"
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={videoSrc}
              controls
              // Hide the download/PiP/remote-playback controls so the obvious
              // "save this video" paths are gone. The right-click "Save video
              // as" menu is blocked by onContextMenu on the wrapper.
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="aspect-video w-full rounded-lg bg-black"
            />
            <span className="pointer-events-none absolute right-3 top-3 select-none rounded-md bg-black/40 px-2 py-1 text-[11px] font-bold uppercase tracking-widest text-white/75 backdrop-blur-sm">
              Syllabify
            </span>
          </div>
        )}

        {material.type === 'note' && (
          <div
            className="prose prose-slate max-w-none px-3 py-2 prose-headings:tracking-tight prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: sanitize(material.content ?? '') }}
          />
        )}
      </div>
    </article>
  )
}
