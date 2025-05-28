import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  // Return null if we're on the server
  if (typeof window === "undefined") {
    return null
  }

  // Create singleton instance
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      return null
    }

    supabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
}

// Create and export the client instance
export const supabase = typeof window !== "undefined" ? createClient() : null
