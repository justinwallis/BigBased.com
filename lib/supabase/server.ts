import { createClient } from "@supabase/supabase-js"

// Note: Use this only in server components
export function createServerClient(supabaseUrl: string, supabaseKey: string, options: any) {
  return createClient(supabaseUrl, supabaseKey, options)
}
