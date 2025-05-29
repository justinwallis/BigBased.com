"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function createUserSessionsTable() {
  try {
    const supabase = createServerSupabaseClient()

    // Check if user is authenticated
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Not authenticated" }
    }

    console.log("Creating user_sessions table...")

    // Create the table using a direct SQL query
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: `
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

        -- Create indexes for faster queries
        CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON public.user_sessions(session_token);
        CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON public.user_sessions(last_activity);

        -- Enable RLS
        ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
        DROP POLICY IF EXISTS "Users can insert their own sessions" ON public.user_sessions;
        DROP POLICY IF EXISTS "Users can update their own sessions" ON public.user_sessions;
        DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.user_sessions;

        -- Create RLS policies
        CREATE POLICY "Users can view their own sessions" ON public.user_sessions
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own sessions" ON public.user_sessions
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own sessions" ON public.user_sessions
          FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own sessions" ON public.user_sessions
          FOR DELETE USING (auth.uid() = user_id);
      `,
    })

    if (error) {
      console.error("Error creating table:", error)
      return { success: false, error: error.message }
    }

    console.log("Table creation result:", data)

    // Test if table was created successfully
    const { data: testData, error: testError } = await supabase.from("user_sessions").select("id").limit(1)

    if (testError) {
      console.error("Table test failed:", testError)
      return { success: false, error: `Table creation failed: ${testError.message}` }
    }

    return { success: true, message: "Table created successfully" }
  } catch (error) {
    console.error("Error in createUserSessionsTable:", error)
    return { success: false, error: String(error) }
  }
}

export async function checkTableExists() {
  try {
    const supabase = createServerSupabaseClient()

    // Check if user is authenticated
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Not authenticated" }
    }

    // Try to query the table
    const { data, error } = await supabase.from("user_sessions").select("id").limit(1)

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return { success: true, exists: false, error: error.message }
      }
      return { success: false, error: error.message }
    }

    return { success: true, exists: true, data }
  } catch (error) {
    console.error("Error checking table:", error)
    return { success: false, error: String(error) }
  }
}

// Add the missing export
export async function createTableAction() {
  return await createUserSessionsTable()
}
