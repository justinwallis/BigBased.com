"use client"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for the entire client-side application
let supabase: ReturnType<typeof createClient<Database>> | null = null

export function supabaseClient() {
  // Only initialize on the client side
  if (typeof window === "undefined") {
    return null
  }

  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      return null
    }

    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  return supabase
}
