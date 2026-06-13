// Hand-authored Supabase types. Once your project exists you can
// regenerate with:
//   npx supabase gen types typescript --project-id <id> > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type MaterialType = 'pdf' | 'video' | 'note'
export type UserRole = 'student' | 'admin'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: UserRole
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          is_verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          is_verified?: boolean
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          thumbnail_url: string | null
          category_id: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          thumbnail_url?: string | null
          category_id?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          thumbnail_url?: string | null
          category_id?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      materials: {
        Row: {
          id: string
          course_id: string | null
          title: string
          type: MaterialType | null
          cloudinary_public_id: string | null
          cloudinary_url: string | null
          content: string | null
          order_index: number
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          course_id?: string | null
          title: string
          type?: MaterialType | null
          cloudinary_public_id?: string | null
          cloudinary_url?: string | null
          content?: string | null
          order_index?: number
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string | null
          title?: string
          type?: MaterialType | null
          cloudinary_public_id?: string | null
          cloudinary_url?: string | null
          content?: string | null
          order_index?: number
          is_published?: boolean
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string | null
          course_id: string | null
          enrolled_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          enrolled_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          enrolled_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string | null
          material_id: string | null
          completed: boolean
          last_accessed: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          material_id?: string | null
          completed?: boolean
          last_accessed?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          material_id?: string | null
          completed?: boolean
          last_accessed?: string
        }
      }
    }
    Views: { [key: string]: never }
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
    }
    Enums: { [key: string]: never }
  }
}

// Convenience row aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Material = Database['public']['Tables']['materials']['Row']
export type Enrollment = Database['public']['Tables']['enrollments']['Row']
export type Progress = Database['public']['Tables']['progress']['Row']

export type CourseWithCategory = Course & {
  categories: Pick<Category, 'id' | 'name' | 'slug'> | null
  materials?: { count: number }[]
}
