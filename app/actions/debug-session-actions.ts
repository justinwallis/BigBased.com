"use server"

import { trackSession, getUserSessions } from "./session-actions"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function debugSessionTracking() {
  console.log("=== Debug Session Tracking ===")

  try {
    // Test database connection
    const supabase = createServerSupabaseClient()

    // Check if user is authenticated
    const { data: userData, error: userError } = await supabase.auth.getUser()
    console.log("User data:", userData?.user?.id, "Error:", userError?.message)

    if (!userData.user) {
      return { success: false, error: "Not authenticated" }
    }

    // Test basic database connection
    const { data: basicTest, error: basicError } = await supabase
      .from("auth.users")
      .select("id")
      .eq("id", userData.user.id)
      .single()

    console.log("Basic auth test - Data:", basicTest?.id, "Error:", basicError?.message)

    // Check if table exists in different schemas
    const { data: tableCheck, error: tableError } = await supabase.rpc("check_table_exists", {
      table_name: "user_sessions",
    })

    console.log("Table check RPC - Data:", tableCheck, "Error:", tableError?.message)

    // Try to access the table directly
    const { data: directTest, error: directError } = await supabase.from("user_sessions").select("id").limit(1)

    console.log("Direct table test - Data:", directTest, "Error:", directError)

    // Try with explicit schema
    const { data: schemaTest, error: schemaError } = await supabase.from("public.user_sessions").select("id").limit(1)

    console.log("Schema table test - Data:", schemaTest, "Error:", schemaError)

    // Check current user's permissions
    const { data: permTest, error: permError } = await supabase.rpc("check_user_permissions")

    console.log("Permission test - Data:", permTest, "Error:", permError?.message)

    // Try to track session
    const trackResult = await trackSession()
    console.log("Track session result:", trackResult)

    // Try to get sessions
    const sessionsResult = await getUserSessions()
    console.log("Get sessions result:", sessionsResult)

    return {
      success: true,
      user: userData.user.id,
      basicTest: { data: basicTest?.id, error: basicError?.message },
      tableCheck: { data: tableCheck, error: tableError?.message },
      directTest: { data: directTest, error: directError?.message },
      schemaTest: { data: schemaTest, error: schemaError?.message },
      permTest: { data: permTest, error: permError?.message },
      trackResult,
      sessionsResult,
    }
  } catch (error) {
    console.error("Debug session tracking error:", error)
    return {
      success: false,
      error: `Debug failed: ${error}`,
    }
  }
}

export async function createTableIfNotExists() {
  console.log("=== Creating Table ===")

  try {
    const supabase = createServerSupabaseClient()

    // Check if user is authenticated
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (!userData.user) {
      return { success: false, error: "Not authenticated" }
    }

    // Create the table using SQL
    const createTableSQL = `
      -- Create user_sessions table for tracking active sessions
      CREATE TABLE IF NOT EXISTS public.user_sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        session_token TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        location TEXT,
        device_type TEXT DEFAULT 'desktop',
        browser TEXT DEFAULT 'unknown',
        os TEXT DEFAULT 'unknown',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_activity TIMESTAMPTZ DEFAULT NOW(),
        expires_at TIMESTAMPTZ,
        UNIQUE(session_token)
      );

      -- Create index for faster queries
      CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON public.user_sessions(session_token);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON public.user_sessions(last_activity);

      -- Enable RLS
      ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies
      DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
      DROP POLICY IF EXISTS "Users can insert their own sessions" ON public.user_sessions;
      DROP POLICY IF EXISTS "Users can update their own sessions" ON public.user_sessions;
      DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.user_sessions;

      CREATE POLICY "Users can view their own sessions" ON public.user_sessions
        FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert their own sessions" ON public.user_sessions
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update their own sessions" ON public.user_sessions
        FOR UPDATE USING (auth.uid() = user_id);

      CREATE POLICY "Users can delete their own sessions" ON public.user_sessions
        FOR DELETE USING (auth.uid() = user_id);
    `

    const { data, error } = await supabase.rpc("exec_sql", { sql: createTableSQL })

    console.log("Create table result - Data:", data, "Error:", error)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Create table error:", error)
    return { success: false, error: String(error) }
  }
}
