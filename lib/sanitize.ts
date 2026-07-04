import DOMPurify from 'isomorphic-dompurify'

/** Sanitises admin-authored note HTML before it is rendered. */
export function sanitize(html: string) {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'style'],
  })
}
