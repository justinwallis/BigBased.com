import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for interacting with your database
let supabase: ReturnType<typeof createClient<Database>> | null = null

export function supabaseClient() {
  if (supabase) return supabase

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    return null
  }

  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: "sb-access-token",
      storage: {
        getItem: (key) => {
          if (typeof window === "undefined") {
            return null
          }
          return JSON.parse(window.localStorage.getItem(key) || "null")
        },
        setItem: (key, value) => {
          if (typeof window === "undefined") {
            return
          }
          window.localStorage.setItem(key, JSON.stringify(value))
          // Also set a cookie for the middleware to check
          document.cookie = `${key}=true; path=/; max-age=2592000; SameSite=Lax` // 30 days
        },
        removeItem: (key) => {
          if (typeof window === "undefined") {
            return
          }
          window.localStorage.removeItem(key)
          // Also remove the cookie
          document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
        },
      },
    },
  })

  return supabase
}
