export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          website: string | null
          location: string | null
          created_at: string | null
          updated_at: string | null
          social_links: Json | null
          banner_position: string | null
          email: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          created_at?: string | null
          updated_at?: string | null
          social_links?: Json | null
          banner_position?: string | null
          email?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          created_at?: string | null
          updated_at?: string | null
          social_links?: Json | null
          banner_position?: string | null
          email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_customers: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
