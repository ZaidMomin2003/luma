// ─── Supabase Database Types ─────────────────────────────────────────────────
// These match the schema defined in implementation.md Phase 3

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          firebase_uid: string
          email: string
          name: string | null
          company: string | null
          plan: 'free' | 'starter' | 'pro' | 'enterprise'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          firebase_uid: string
          email: string
          name?: string | null
          company?: string | null
          plan?: 'free' | 'starter' | 'pro' | 'enterprise'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string | null
          company?: string | null
          plan?: 'free' | 'starter' | 'pro' | 'enterprise'
          avatar_url?: string | null
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: 'draft' | 'processing' | 'active' | 'completed' | 'paused'
          use_case: string | null
          language: string
          video_url: string | null
          thumbnail_url: string | null
          video_duration: number | null
          settings: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: 'draft' | 'processing' | 'active' | 'completed' | 'paused'
          use_case?: string | null
          language?: string
          video_url?: string | null
          thumbnail_url?: string | null
          video_duration?: number | null
          settings?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          status?: 'draft' | 'processing' | 'active' | 'completed' | 'paused'
          use_case?: string | null
          language?: string
          video_url?: string | null
          thumbnail_url?: string | null
          video_duration?: number | null
          settings?: Record<string, unknown>
          updated_at?: string
        }
      }
      campaign_questions: {
        Row: {
          id: string
          campaign_id: string
          timestamp_sec: number
          text: string
          type: 'mcq' | 'yesno' | 'oneword' | 'multi'
          options: string[]
          required: boolean
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          timestamp_sec: number
          text: string
          type: 'mcq' | 'yesno' | 'oneword' | 'multi'
          options?: string[]
          required?: boolean
          order?: number
          created_at?: string
        }
        Update: {
          timestamp_sec?: number
          text?: string
          type?: 'mcq' | 'yesno' | 'oneword' | 'multi'
          options?: string[]
          required?: boolean
          order?: number
        }
      }
      viewer_sessions: {
        Row: {
          id: string
          campaign_id: string
          viewer_id: string | null
          viewer_email: string | null
          started_at: string
          completed_at: string | null
          watch_time: number
          completed: boolean
          region: string | null
          device: string | null
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          viewer_id?: string | null
          viewer_email?: string | null
          started_at?: string
          completed_at?: string | null
          watch_time?: number
          completed?: boolean
          region?: string | null
          device?: string | null
          created_at?: string
        }
        Update: {
          completed_at?: string | null
          watch_time?: number
          completed?: boolean
        }
      }
      viewer_responses: {
        Row: {
          id: string
          session_id: string
          question_id: string
          answer: string
          correct: boolean | null
          answered_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question_id: string
          answer: string
          correct?: boolean | null
          answered_at?: string
        }
        Update: {}
      }
    }
  }
}
