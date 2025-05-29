"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function debugDatabaseConnection() {
  try {
    const supabase = createServerSupabaseClient()

    // Get user authentication status
    const { data: userData, error: userError } = await supabase.auth.getUser()

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      user: userData?.user?.id || null,
      userError: userError?.message || null,
      tests: [] as any[],
    }

    // Test 1: Basic connection
    try {
      const { data, error } = await supabase.from("auth.users").select("id").limit(1)
      result.tests.push({
        name: "Basic connection test",
        success: !error,
        data: data?.length || 0,
        error: error?.message || null,
      })
    } catch (err) {
      result.tests.push({
        name: "Basic connection test",
        success: false,
        error: String(err),
      })
    }

    // Test 2: Check what tables exist
    try {
      const { data, error } = await supabase.rpc("exec_sql", {
        sql: `
          SELECT table_schema, table_name 
          FROM information_schema.tables 
          WHERE table_schema IN ('public', 'auth')
          ORDER BY table_schema, table_name;
        `,
      })
      result.tests.push({
        name: "List tables",
        success: !error,
        data: data,
        error: error?.message || null,
      })
    } catch (err) {
      result.tests.push({
        name: "List tables",
        success: false,
        error: String(err),
      })
    }

    // Test 3: Check database name/connection
    try {
      const { data, error } = await supabase.rpc("exec_sql", {
        sql: `SELECT current_database(), current_user, version();`,
      })
      result.tests.push({
        name: "Database info",
        success: !error,
        data: data,
        error: error?.message || null,
      })
    } catch (err) {
      result.tests.push({
        name: "Database info",
        success: false,
        error: String(err),
      })
    }

    // Test 4: Try to create a simple test table
    try {
      const { data, error } = await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS public.test_connection (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          INSERT INTO public.test_connection DEFAULT VALUES;
          SELECT COUNT(*) as count FROM public.test_connection;
          DROP TABLE public.test_connection;
        `,
      })
      result.tests.push({
        name: "Create/drop test table",
        success: !error,
        data: data,
        error: error?.message || null,
      })
    } catch (err) {
      result.tests.push({
        name: "Create/drop test table",
        success: false,
        error: String(err),
      })
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: String(error),
      timestamp: new Date().toISOString(),
    }
  }
}

export async function checkEnvironmentVariables() {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL ? "Set" : "Missing",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "Set" : "Missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
      DATABASE_URL: process.env.DATABASE_URL ? "Set" : "Missing",
      NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? "Set" : "Missing",
      // Show first few characters of URLs for debugging (safely)
      SUPABASE_URL_PREFIX: process.env.SUPABASE_URL?.substring(0, 30) + "..." || "Not set",
      DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 30) + "..." || "Not set",
    },
  }
}

export async function createTableWithRawSQL() {
  try {
    const supabase = createServerSupabaseClient()

    // Check if user is authenticated
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Not authenticated" }
    }

    // Try to create the table using raw SQL
    const createTableSQL = `
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

      CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON public.user_sessions(session_token);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON public.user_sessions(last_activity);

      ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

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

    if (error) {
      return { success: false, error: error.message, details: error }
    }

    // Test if the table was created
    const { data: testData, error: testError } = await supabase.from("user_sessions").select("id").limit(1)

    if (testError) {
      return {
        success: false,
        error: `Table creation may have failed: ${testError.message}`,
        sqlResult: data,
      }
    }

    return {
      success: true,
      message: "Table created successfully",
      sqlResult: data,
      testResult: testData,
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
