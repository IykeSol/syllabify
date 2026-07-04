/**
 * Client-safe Cloudinary URL builders. No secrets here — only the public
 * cloud name. PDFs and videos are always delivered *inline* through these
 * helpers so there is no direct download URL exposed in the UI.
 */
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

/**
 * Inline PDF delivery URL (rendered in an iframe, never downloaded).
 * Note: do NOT add `fl_attachment` here — Cloudinary reads `fl_attachment:false`
 * as "attach with filename 'false'", which sets `Content-Disposition: attachment`
 * and makes the browser download (blank iframe) instead of rendering inline.
 * Plain image delivery has no Content-Disposition, so the PDF renders inline.
 */
export function pdfUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${publicId}.pdf`
}

/**
 * A single PDF page rendered as a watermarked JPG. Used by the view-only
 * reader: pages are shown as <img> we control (not the native PDF viewer),
 * so there is no Save/Print menu, and a "SYLLABIFY" watermark is baked into
 * the delivered bytes (so even a grabbed copy stays marked).
 */
export function pdfPageImageUrl(publicId: string, page: number) {
  return (
    `https://res.cloudinary.com/${CLOUD}/image/upload/` +
    `pg_${page},w_1200,q_auto/` +
    `l_text:Arial_110_bold:SYLLABIFY,co_rgb:9aa0a6,o_22,a_-30/fl_layer_apply,g_center/` +
    `${publicId}.jpg`
  )
}

/** HLS / mp4 video delivery URL for the inline player. */
export function videoUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD}/video/upload/${publicId}.mp4`
}

/** Optimised thumbnail/image delivery URL. */
export function imageUrl(publicId: string, width = 800) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_${width}/${publicId}`
}
