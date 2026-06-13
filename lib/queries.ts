import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/constants'
import type { Course, Category, Material, Profile } from '@/types/database'

/**
 * Every fetcher degrades gracefully: if Supabase isn't configured (local
 * preview) or a query fails, it returns a safe empty value so pages render
 * their empty states instead of crashing.
 */

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    return data ?? null
  } catch {
    return null
  }
}

export type CourseCard = Course & {
  categories: Pick<Category, 'id' | 'name' | 'slug'> | null
  materials: { count: number }[]
}

export async function getPublishedCourses(opts?: {
  search?: string
  category?: string
}): Promise<CourseCard[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    let query = supabase
      .from('courses')
      .select('*, categories(id, name, slug), materials(count)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (opts?.search) query = query.ilike('title', `%${opts.search}%`)
    if (opts?.category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', opts.category)
        .single()
      if (cat) query = query.eq('category_id', cat.id)
    }
    const { data } = await query
    return (data as CourseCard[]) ?? []
  } catch {
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    return data ?? []
  } catch {
    return []
  }
}

export async function getCourseBySlug(slug: string) {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createClient()
    const { data: course } = await supabase
      .from('courses')
      .select('*, categories(id, name, slug)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    if (!course) return null

    const { data: materials } = await supabase
      .from('materials')
      .select('*')
      .eq('course_id', course.id)
      .eq('is_published', true)
      .order('order_index')

    return { course, materials: (materials as Material[]) ?? [] }
  } catch {
    return null
  }
}

export async function getEnrolledCourses(userId: string) {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('enrollments')
      .select('course_id, enrolled_at, courses(*, categories(id, name, slug), materials(count))')
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export async function isEnrolled(userId: string, courseId: string) {
  if (!isSupabaseConfigured()) return false
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle()
    return Boolean(data)
  } catch {
    return false
  }
}

export async function getProgressForUser(userId: string) {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('progress')
      .select('material_id, completed')
      .eq('user_id', userId)
    return data ?? []
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------
// Admin (service-role) reads — used only inside /admin pages, which are
// already gated to the admin email by middleware.
// ---------------------------------------------------------------------

export async function getAdminStats() {
  if (!isSupabaseConfigured()) {
    return { courses: 0, materials: 0, students: 0, published: 0 }
  }
  try {
    const db = createAdminClient()
    const [courses, materials, students, published] = await Promise.all([
      db.from('courses').select('id', { count: 'exact', head: true }),
      db.from('materials').select('id', { count: 'exact', head: true }),
      db.from('enrollments').select('user_id', { count: 'exact', head: true }),
      db.from('courses').select('id', { count: 'exact', head: true }).eq('is_published', true),
    ])
    return {
      courses: courses.count ?? 0,
      materials: materials.count ?? 0,
      students: students.count ?? 0,
      published: published.count ?? 0,
    }
  } catch {
    return { courses: 0, materials: 0, students: 0, published: 0 }
  }
}

export async function getAllCoursesAdmin() {
  if (!isSupabaseConfigured()) return []
  try {
    const db = createAdminClient()
    const { data } = await db
      .from('courses')
      .select('*, categories(id, name, slug), materials(count)')
      .order('created_at', { ascending: false })
    return (data as CourseCard[]) ?? []
  } catch {
    return []
  }
}

export async function getCourseByIdAdmin(id: string) {
  if (!isSupabaseConfigured()) return null
  try {
    const db = createAdminClient()
    const { data } = await db.from('courses').select('*').eq('id', id).single()
    return data ?? null
  } catch {
    return null
  }
}

export async function getMaterialsAdmin(courseId: string) {
  if (!isSupabaseConfigured()) return []
  try {
    const db = createAdminClient()
    const { data } = await db
      .from('materials')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index')
    return (data as Material[]) ?? []
  } catch {
    return []
  }
}
