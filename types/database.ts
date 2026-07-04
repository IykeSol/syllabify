// Generated from the live Supabase project (with hand-written convenience
// aliases at the bottom). Regenerate the Database type after schema changes:
//   npx supabase gen types typescript --project-id <id> > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          audience: string
          category_id: string | null
          created_at: string | null
          department_id: string | null
          description: string | null
          id: string
          is_general: boolean | null
          is_published: boolean | null
          kind: string
          level: number | null
          semester: number | null
          slug: string
          thumbnail_url: string | null
          title: string
          university_id: string | null
          updated_at: string | null
        }
        Insert: {
          audience?: string
          category_id?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          is_general?: boolean | null
          is_published?: boolean | null
          kind?: string
          level?: number | null
          semester?: number | null
          slug: string
          thumbnail_url?: string | null
          title: string
          university_id?: string | null
          updated_at?: string | null
        }
        Update: {
          audience?: string
          category_id?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          is_general?: boolean | null
          is_published?: boolean | null
          kind?: string
          level?: number | null
          semester?: number | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          university_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          faculty: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          faculty?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          faculty?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string | null
          enrolled_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          cloudinary_public_id: string | null
          cloudinary_url: string | null
          content: string | null
          course_id: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          order_index: number | null
          title: string
          type: string | null
        }
        Insert: {
          cloudinary_public_id?: string | null
          cloudinary_url?: string | null
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          title: string
          type?: string | null
        }
        Update: {
          cloudinary_public_id?: string | null
          cloudinary_url?: string | null
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          role: string | null
          track: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          role?: string | null
          track?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          role?: string | null
          track?: string | null
        }
        Relationships: []
      }
      progress: {
        Row: {
          completed: boolean | null
          id: string
          last_accessed: string | null
          material_id: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          id?: string
          last_accessed?: string | null
          material_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          id?: string
          last_accessed?: string | null
          material_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          abbreviation: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          ownership: string
          slug: string
          state: string
        }
        Insert: {
          abbreviation?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          ownership: string
          slug: string
          state: string
        }
        Update: {
          abbreviation?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          ownership?: string
          slug?: string
          state?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<TableName extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][TableName]["Row"]

// ---------------------------------------------------------------------
// Convenience aliases. The DB stores these as plain text, so the rows are
// narrowed to the unions the app actually writes (see lib/actions.ts).
// ---------------------------------------------------------------------

export type MaterialType = 'pdf' | 'video' | 'note'
export type UserRole = 'student' | 'admin'
/** Who a course is for. 'both' appears under either audience filter. */
export type CourseAudience = 'students' | 'graduates' | 'both'
export type UniversityOwnership = 'federal' | 'state' | 'private'
/** Which journey a learner is on — chosen at signup, editable on the dashboard. */
export type LearnerTrack = 'student' | 'graduate'
/**
 * What a course is. Access is gated by track:
 * university → students, graduate_brochure → graduates, digital_skill → both.
 */
export type CourseKind = 'university' | 'digital_skill' | 'graduate_brochure'
/** Year of study for a university course. */
export type CourseLevel = 100 | 200 | 300 | 400 | 500 | 600
/** 1 = first semester, 2 = second semester. */
export type CourseSemester = 1 | 2

export type Profile = Omit<Tables<'profiles'>, 'role' | 'track'> & {
  role: UserRole | null
  track: LearnerTrack | null
}
export type Category = Tables<'categories'>
export type Course = Omit<
  Tables<'courses'>,
  'audience' | 'is_published' | 'kind' | 'level' | 'semester' | 'is_general'
> & {
  audience: CourseAudience
  is_published: boolean
  kind: CourseKind
  level: CourseLevel | null
  semester: CourseSemester | null
  is_general: boolean
}
export type Material = Omit<Tables<'materials'>, 'type' | 'is_published'> & {
  type: MaterialType | null
  is_published: boolean
}
export type Enrollment = Tables<'enrollments'>
export type Progress = Tables<'progress'>
export type University = Omit<Tables<'universities'>, 'ownership' | 'is_active'> & {
  ownership: UniversityOwnership
  is_active: boolean
}
export type Department = Tables<'departments'>

export type CourseWithCategory = Course & {
  categories: Pick<Category, 'id' | 'name' | 'slug'> | null
  materials?: { count: number }[]
}
