'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { slugify } from '@/lib/constants'

type Result = { success?: true; error?: string }

// ---------------------------------------------------------------------
// Student actions
// ---------------------------------------------------------------------

export async function enrollInCourse(courseId: string): Promise<Result> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Please sign in to enrol.' }

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
  thumbnail_url?: string | null
  is_published?: boolean
}

export async function saveCourse(input: CourseInput): Promise<Result & { slug?: string }> {
  try {
    await requireAdmin()
    const db = createAdminClient()
    const payload = {
      title: input.title.trim(),
      slug: slugify(input.title),
      description: input.description?.trim() || null,
      category_id: input.category_id || null,
      thumbnail_url: input.thumbnail_url || null,
      is_published: input.is_published ?? false,
    }

    if (input.id) {
      const { error } = await db.from('courses').update(payload).eq('id', input.id)
      if (error) return { error: error.message }
    } else {
      const { error } = await db.from('courses').insert(payload)
      if (error) return { error: error.message }
    }
    revalidatePath('/admin/courses')
    revalidatePath('/courses')
    return { success: true, slug: payload.slug }
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
    revalidatePath(`/admin/materials/${input.course_id}`)
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
    revalidatePath(`/admin/materials/${courseId}`)
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
    revalidatePath(`/admin/materials/${courseId}`)
    return { success: true }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
