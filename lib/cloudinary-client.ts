/**
 * Client-safe Cloudinary URL builders. No secrets here — only the public
 * cloud name. PDFs and videos are always delivered *inline* through these
 * helpers so there is no direct download URL exposed in the UI.
 */
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

/** Inline PDF delivery URL (rendered in an iframe, never downloaded). */
export function pdfUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/fl_attachment:false/${publicId}.pdf`
}

/** HLS / mp4 video delivery URL for the inline player. */
export function videoUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD}/video/upload/${publicId}.mp4`
}

/** Optimised thumbnail/image delivery URL. */
export function imageUrl(publicId: string, width = 800) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_${width}/${publicId}`
}
