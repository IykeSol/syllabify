import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/constants'
import type {
  Course,
  CourseWithCategory,
  Category,
  LearnerTrack,
  Material,
  Profile,
  University,
  Department,
} from '@/types/database'

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
    return (data as Profile | null) ?? null
  } catch {
    return null
  }
}

export type CourseCard = Course & {
  categories: Pick<Category, 'id' | 'name' | 'slug'> | null
  universities: Pick<University, 'id' | 'name' | 'abbreviation'> | null
  departments: Pick<Department, 'id' | 'name'> | null
  materials: { count: number }[]
}

const COURSE_CARD_SELECT =
  '*, categories(id, name, slug), universities(id, name, abbreviation), departments(id, name), materials(count)'

export async function getPublishedCourses(opts?: {
  search?: string
  category?: string
  kind?: string
  /** Limits visibility to what this learner track may enrol in. */
  track?: LearnerTrack | null
  university?: string
  department?: string
  level?: string
  semester?: string
}): Promise<CourseCard[]> {
  if (!isSupabaseConfigured()) return []
  try {
    // Admin client so the published-material *count* is visible to everyone.
    // The materials RLS policy hides materials from non-enrolled users, which
    // would otherwise zero out the count on the public catalogue. We only read
    // published courses + a count here — never material content.
    const supabase = createAdminClient()
    let query = supabase
      .from('courses')
      .select(COURSE_CARD_SELECT)
      .eq('is_published', true)
      .eq('materials.is_published', true)
      .order('created_at', { ascending: false })

    if (opts?.search) query = query.ilike('title', `%${opts.search}%`)
    // Students never see graduate brochures; graduates never see university
    // courses. Digital skills show for everyone.
    if (opts?.track === 'student') {
      query = query.in('kind', ['university', 'digital_skill'])
    } else if (opts?.track === 'graduate') {
      query = query.in('kind', ['graduate_brochure', 'digital_skill'])
    }
    if (opts?.kind) query = query.eq('kind', opts.kind)
    if (opts?.category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', opts.category)
        .single()
      if (cat) query = query.eq('category_id', cat.id)
    }
    if (opts?.university) {
      const { data: uni } = await supabase
        .from('universities')
        .select('id')
        .eq('slug', opts.university)
        .single()
      // A course with no university applies to every school.
      if (uni) query = query.or(`university_id.eq.${uni.id},university_id.is.null`)
    }
    if (opts?.department) {
      const { data: dept } = await supabase
        .from('departments')
        .select('id')
        .eq('slug', opts.department)
        .single()
      // A department's students also see the shared general courses (dept null).
      if (dept) query = query.or(`department_id.eq.${dept.id},department_id.is.null`)
    }
    const level = opts?.level ? Number(opts.level) : null
    if (level) query = query.eq('level', level)
    const semester = opts?.semester ? Number(opts.semester) : null
    if (semester) query = query.eq('semester', semester)
    const { data } = await query
    return (data as CourseCard[]) ?? []
  } catch {
    return []
  }
}

/** Listed (active) universities, for public filters and the course form. */
export async function getActiveUniversities(): Promise<University[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('universities')
      .select('*')
      .eq('is_active', true)
      .order('name')
    return (data as University[]) ?? []
  } catch {
    return []
  }
}

export async function getDepartments(): Promise<Department[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('departments')
      .select('*')
      .order('faculty')
      .order('name')
    return data ?? []
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
    const { data } = await supabase
      .from('courses')
      .select('*, categories(id, name, slug)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    if (!data) return null
    const course = data as CourseWithCategory

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
      .select(`course_id, enrolled_at, courses(${COURSE_CARD_SELECT})`)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export async function getDashboard(userId: string) {
  const empty = { items: [] as { course: CourseCard; progress: number }[] }
  if (!isSupabaseConfigured()) return empty
  try {
    const supabase = await createClient()
    // These two reads are independent — run them in parallel.
    const [{ data: enrollments }, { data: completed }] = await Promise.all([
      supabase
        .from('enrollments')
        .select(`course:courses(${COURSE_CARD_SELECT})`)
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false }),
      supabase
        .from('progress')
        .select('materials(course_id)')
        .eq('user_id', userId)
        .eq('completed', true),
    ])

    const completedByCourse: Record<string, number> = {}
    ;(completed ?? []).forEach((row) => {
      const cid = (row as { materials: { course_id: string | null } | null }).materials
        ?.course_id
      if (cid) completedByCourse[cid] = (completedByCourse[cid] ?? 0) + 1
    })

    const items = (enrollments ?? [])
      .map((e) => (e as { course: CourseCard | null }).course)
      .filter((c): c is CourseCard => Boolean(c))
      .map((course) => {
        const total = course.materials?.[0]?.count ?? 0
        const done = completedByCourse[course.id] ?? 0
        return { course, progress: total ? Math.round((done / total) * 100) : 0 }
      })

    return { items }
  } catch {
    return empty
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

export async function getEnrollmentIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', userId)
    return (data ?? [])
      .map((r) => r.course_id)
      .filter((x): x is string => Boolean(x))
  } catch {
    return []
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
      .select(COURSE_CARD_SELECT)
      .order('created_at', { ascending: false })
    return (data as CourseCard[]) ?? []
  } catch {
    return []
  }
}

/** Every university, including delisted ones — admin table only. */
export async function getAllUniversitiesAdmin(): Promise<University[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const db = createAdminClient()
    const { data } = await db.from('universities').select('*').order('name')
    return (data as University[]) ?? []
  } catch {
    return []
  }
}

export async function getCourseByIdAdmin(id: string) {
  if (!isSupabaseConfigured()) return null
  try {
    const db = createAdminClient()
    const { data } = await db.from('courses').select('*').eq('id', id).single()
    return (data as Course | null) ?? null
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
