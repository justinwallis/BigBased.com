import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for admin operations
const supabaseAdmin = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

export { supabaseAdmin }
