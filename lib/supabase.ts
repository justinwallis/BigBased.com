import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Create a single supabase client for interacting with your database
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// Export for backward compatibility
export default supabase
