import { createServerClient as _createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient(useServiceRole = false) {
  const cookieStore = cookies()

  // IMPORTANT: Make sure we're using Supabase URLs, not Neon
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      useServiceRole,
      urlPreview: supabaseUrl?.substring(0, 30) + "...",
    })
    throw new Error("Missing Supabase environment variables")
  }

  // Log what we're connecting to
  console.log("Supabase client config:", {
    url: supabaseUrl.substring(0, 50) + "...",
    keyType: useServiceRole ? "service_role" : "anon",
    keyPrefix: supabaseKey.substring(0, 20) + "...",
  })

  return _createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      async get(name: string) {
        return (await cookieStore.get(name))?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          console.error("Error setting cookie:", error)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 })
        } catch (error) {
          console.error("Error removing cookie:", error)
        }
      },
    },
  })
}

export function createServerSupabaseClient() {
  return createClient()
}

export function createRouteHandlerClient() {
  return createClient()
}

// Export all the required named exports for backward compatibility
export const createServerClient = createClient

// Default export
export default createClient
