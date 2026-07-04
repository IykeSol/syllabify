'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { slugify } from '@/lib/constants'
import type {
  CourseAudience,
  CourseKind,
  CourseLevel,
  CourseSemester,
  LearnerTrack,
  UniversityOwnership,
} from '@/types/database'

type Result = { success?: true; error?: string }

// ---------------------------------------------------------------------
// Student actions
// ---------------------------------------------------------------------

/** Who may enrol in each kind of course. */
function canEnroll(kind: CourseKind, track: LearnerTrack | null): string | null {
  if (kind === 'university' && track !== 'student') {
    return 'University courses are for university students. Set your track to “University student” on your dashboard if that’s you.'
  }
  if (kind === 'graduate_brochure' && track !== 'graduate') {
    return 'Graduate trainee brochures are for fresh graduates. Set your track to “Fresh graduate” on your dashboard if that’s you.'
  }
  return null
}

export async function enrollInCourse(courseId: string): Promise<Result> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Please sign in to enrol.' }

  // Track ↔ kind gating (server-side, admin client so RLS can't hide rows).
  const db = createAdminClient()
  const [{ data: course }, { data: profile }] = await Promise.all([
    db.from('courses').select('kind').eq('id', courseId).single(),
    db.from('profiles').select('track').eq('id', user.id).single(),
  ])
  if (!course) return { error: 'Course not found.' }
  const denied = canEnroll(
    course.kind as CourseKind,
    (profile?.track as LearnerTrack | null) ?? null,
  )
  if (denied) return { error: denied }

  const { error } = await supabase
    .from('enrollments')
    .insert({ user_id: user.id, course_id: courseId })

  if (error && !error.message.toLowerCase().includes('duplicate')) {
    return { error: error.message }
  }
  revalidatePath('/courses')
  revalidatePath('/dashboard')
  return { success: true }
}

/** Let a signed-in user set (or fix) their learner track. */
export async function setProfileTrack(track: LearnerTrack): Promise<Result> {
  if (track !== 'student' && track !== 'graduate') {
    return { error: 'Invalid track.' }
  }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Please sign in first.' }

  const { error } = await supabase
    .from('profiles')
    .update({ track })
    .eq('id', user.id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/courses')
  return { success: true }
}

/**
 * Number of pages in an uploaded PDF, via the Cloudinary Admin API.
 * Server-only (uses the API secret). Defaults to 1 on any failure so the
 * view-only reader still shows the first page.
 *
 * Server Actions are public HTTP endpoints, so this guards itself: the
 * caller must be signed in, and the publicId must belong to one of our
 * materials — otherwise anyone could use it to probe the Cloudinary
 * account or burn its Admin API rate limit.
 */
export async function getPdfPageCount(publicId: string): Promise<number> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return 1

    // Cloudinary public IDs are folder/file segments; reject anything else.
    if (!/^[\w][\w./-]*$/.test(publicId) || publicId.includes('..')) return 1

    const db = createAdminClient()
    const { data: material } = await db
      .from('materials')
      .select('id')
      .eq('cloudinary_public_id', publicId)
      .maybeSingle()
    if (!material) return 1

    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const key = process.env.CLOUDINARY_API_KEY
    const secret = process.env.CLOUDINARY_API_SECRET
    if (!cloud || !key || !secret) return 1
    const auth = Buffer.from(`${key}:${secret}`).toString('base64')
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/resources/image/upload/${publicId}?pages=true`,
      { headers: { Authorization: `Basic ${auth}` }, cache: 'no-store' },
    )
    if (!res.ok) return 1
    const data = (await res.json()) as { pages?: number }
    return typeof data.pages === 'number' && data.pages > 0 ? data.pages : 1
  } catch {
    return 1
  }
}

export async function markMaterialComplete(materialId: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('progress').upsert(
    {
      user_id: user.id,
      material_id: materialId,
      completed: true,
      last_accessed: new Date().toISOString(),
    },
    { onConflict: 'user_id,material_id' },
  )
}

// ---------------------------------------------------------------------
// Admin guard + actions (writes use the service-role client)
// ---------------------------------------------------------------------

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
  if (!user || !adminEmail || user.email?.toLowerCase() !== adminEmail) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function createCategory(name: string): Promise<Result & { id?: string }> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    const { data, error } = await db
      .from('categories')
      .insert({ name: name.trim(), slug: slugify(name) })
      .select('id')
      .single()
    if (error) return { error: error.message }
    revalidatePath('/admin/courses')
    return { success: true, id: data.id }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

type CourseInput = {
  id?: string
  title: string
  description?: string
  category_id?: string | null
  university_id?: string | null
  department_id?: string | null
  thumbnail_url?: string | null
  kind?: CourseKind
  level?: CourseLevel | null
  semester?: CourseSemester | null
  is_general?: boolean
  is_published?: boolean
}

/** Keep the legacy audience column in sync with the kind. */
function audienceForKind(kind: CourseKind): CourseAudience {
  if (kind === 'university') return 'students'
  if (kind === 'graduate_brochure') return 'graduates'
  return 'both'
}

export async function saveCourse(
  input: CourseInput,
): Promise<Result & { slug?: string; id?: string }> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    const kind = input.kind ?? 'university'
    const isUniversity = kind === 'university'
    // General studies courses are shared across every department, so they
    // never pin to one department.
    const isGeneral = isUniversity && Boolean(input.is_general)
    const payload = {
      title: input.title.trim(),
      slug: slugify(input.title),
      description: input.description?.trim() || null,
      category_id: input.category_id || null,
      // Only university courses target a school/department/level/semester.
      university_id: isUniversity ? input.university_id || null : null,
      department_id: isUniversity && !isGeneral ? input.department_id || null : null,
      level: isUniversity ? input.level ?? null : null,
      semester: isUniversity ? input.semester ?? null : null,
      is_general: isGeneral,
      thumbnail_url: input.thumbnail_url || null,
      kind,
      audience: audienceForKind(kind),
      is_published: input.is_published ?? false,
    }

    let courseId = input.id
    if (input.id) {
      const { error } = await db.from('courses').update(payload).eq('id', input.id)
      if (error) return { error: error.message }
    } else {
      const { data, error } = await db
        .from('courses')
        .insert(payload)
        .select('id')
        .single()
      if (error) return { error: error.message }
      courseId = data.id
    }
    revalidatePath('/admin/courses')
    revalidatePath('/courses')
    return { success: true, slug: payload.slug, id: courseId }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function toggleCoursePublished(
  id: string,
  isPublished: boolean,
): Promise<Result> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    const { error } = await db
      .from('courses')
      .update({ is_published: isPublished })
      .eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/courses')
    revalidatePath('/courses')
    return { success: true }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deleteCourse(id: string): Promise<Result> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    const { error } = await db.from('courses').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/courses')
    return { success: true }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

// ---------------------------------------------------------------------
// Universities (admin)
// ---------------------------------------------------------------------

/** Pages that read the universities list. */
function revalidateUniversityPaths() {
  revalidatePath('/admin/universities')
  revalidatePath('/courses')
  revalidatePath('/')
}

type UniversityInput = {
  id?: string
  name: string
  abbreviation?: string | null
  state: string
  ownership: UniversityOwnership
}

export async function saveUniversity(
  input: UniversityInput,
): Promise<Result & { id?: string }> {
  try {
    await requireAdmin()
    if (!input.name.trim() || !input.state.trim()) {
      return { error: 'Name and state are required.' }
    }
    const db = createAdminClient()
    const payload = {
      name: input.name.trim(),
      slug: slugify(input.name),
      abbreviation: input.abbreviation?.trim() || null,
      state: input.state.trim(),
      ownership: input.ownership,
    }
    if (input.id) {
      const { error } = await db.from('universities').update(payload).eq('id', input.id)
      if (error) return { error: error.message }
      revalidateUniversityPaths()
      return { success: true, id: input.id }
    }
    const { data, error } = await db
      .from('universities')
      .insert(payload)
      .select('id')
      .single()
    if (error) return { error: error.message }
    revalidateUniversityPaths()
    return { success: true, id: data.id }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

/** Delist (or relist) a university — hidden from students, kept in admin. */
export async function toggleUniversityActive(
  id: string,
  isActive: boolean,
): Promise<Result> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    const { error } = await db
      .from('universities')
      .update({ is_active: isActive })
      .eq('id', id)
    if (error) return { error: error.message }
    revalidateUniversityPaths()
    return { success: true }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deleteUniversity(id: string): Promise<Result> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    // Courses that pointed here fall back to "all universities" (FK: set null).
    const { error } = await db.from('universities').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidateUniversityPaths()
    return { success: true }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function createDepartment(
  name: string,
  faculty?: string,
): Promise<Result & { id?: string }> {
  try {
    await requireAdmin()
    if (!name.trim()) return { error: 'A department name is required.' }
    const db = createAdminClient()
    const { data, error } = await db
      .from('departments')
      .insert({
        name: name.trim(),
        slug: slugify(name),
        faculty: faculty?.trim() || null,
      })
      .select('id')
      .single()
    if (error) return { error: error.message }
    revalidatePath('/admin/universities')
    revalidatePath('/courses')
    return { success: true, id: data.id }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deleteDepartment(id: string): Promise<Result> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    const { error } = await db.from('departments').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/universities')
    revalidatePath('/courses')
    return { success: true }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

/** Revalidate every page whose material list or count can change. */
function revalidateMaterialPaths(courseId: string) {
  revalidatePath(`/admin/materials/${courseId}`)
  revalidatePath(`/admin/courses/${courseId}/edit`)
  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  revalidatePath('/dashboard')
}

type MaterialInput = {
  id?: string
  course_id: string
  title: string
  type: 'pdf' | 'video' | 'note'
  cloudinary_public_id?: string | null
  cloudinary_url?: string | null
  content?: string | null
  order_index?: number
  is_published?: boolean
}

export async function saveMaterial(input: MaterialInput): Promise<Result> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    const payload = {
      course_id: input.course_id,
      title: input.title.trim(),
      type: input.type,
      cloudinary_public_id: input.cloudinary_public_id || null,
      cloudinary_url: input.cloudinary_url || null,
      content: input.content || null,
      order_index: input.order_index ?? 0,
      is_published: input.is_published ?? false,
    }
    if (input.id) {
      const { error } = await db.from('materials').update(payload).eq('id', input.id)
      if (error) return { error: error.message }
    } else {
      const { error } = await db.from('materials').insert(payload)
      if (error) return { error: error.message }
    }
    revalidateMaterialPaths(input.course_id)
    return { success: true }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deleteMaterial(id: string, courseId: string): Promise<Result> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    const { error } = await db.from('materials').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidateMaterialPaths(courseId)
    return { success: true }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function reorderMaterials(
  courseId: string,
  orderedIds: string[],
): Promise<Result> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    await Promise.all(
      orderedIds.map((id, index) =>
        db.from('materials').update({ order_index: index }).eq('id', id),
      ),
    )
    revalidateMaterialPaths(courseId)
    return { success: true }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
