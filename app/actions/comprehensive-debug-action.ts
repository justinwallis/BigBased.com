"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function comprehensiveDebug() {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Not authenticated", user: null }
    }

    const result: any = {
      success: true,
      user: userData.user.id,
      timestamp: new Date().toISOString(),
    }

    // Test 1: Check if we can query information_schema
    try {
      const { data: schemaData, error: schemaError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .eq("table_name", "user_sessions")

      result.schemaCheck = {
        data: schemaData,
        error: schemaError?.message || null,
      }
    } catch (error) {
      result.schemaCheck = { error: String(error) }
    }

    // Test 2: Try direct SQL query to check table existence
    try {
      const { data: sqlData, error: sqlError } = await supabase.rpc("exec_sql", {
        sql: "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_sessions') as table_exists;",
      })

      result.sqlTableCheck = {
        data: sqlData,
        error: sqlError?.message || null,
      }
    } catch (error) {
      result.sqlTableCheck = { error: String(error) }
    }

    // Test 3: Try to describe the table structure
    try {
      const { data: structureData, error: structureError } = await supabase.rpc("exec_sql", {
        sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_sessions' ORDER BY ordinal_position;",
      })

      result.tableStructure = {
        data: structureData,
        error: structureError?.message || null,
      }
    } catch (error) {
      result.tableStructure = { error: String(error) }
    }

    // Test 4: Check RLS policies
    try {
      const { data: rlsData, error: rlsError } = await supabase.rpc("exec_sql", {
        sql: `
          SELECT 
            schemaname,
            tablename,
            policyname,
            permissive,
            roles,
            cmd,
            qual,
            with_check
          FROM pg_policies 
          WHERE schemaname = 'public' AND tablename = 'user_sessions';
        `,
      })

      result.rlsPolicies = {
        data: rlsData,
        error: rlsError?.message || null,
      }
    } catch (error) {
      result.rlsPolicies = { error: String(error) }
    }

    // Test 5: Check if RLS is enabled
    try {
      const { data: rlsEnabledData, error: rlsEnabledError } = await supabase.rpc("exec_sql", {
        sql: `
          SELECT 
            schemaname,
            tablename,
            rowsecurity
          FROM pg_tables 
          WHERE schemaname = 'public' AND tablename = 'user_sessions';
        `,
      })

      result.rlsEnabled = {
        data: rlsEnabledData,
        error: rlsEnabledError?.message || null,
      }
    } catch (error) {
      result.rlsEnabled = { error: String(error) }
    }

    // Test 6: Try direct table access with different approaches
    try {
      const { data: directData, error: directError } = await supabase.from("user_sessions").select("id").limit(1)

      result.directTableAccess = {
        data: directData,
        error: directError?.message || null,
        errorCode: directError?.code || null,
      }
    } catch (error) {
      result.directTableAccess = { error: String(error) }
    }

    // Test 7: Try with service role (if available)
    try {
      const serviceSupabase = createServerSupabaseClient(true) // Use service role
      const { data: serviceData, error: serviceError } = await serviceSupabase
        .from("user_sessions")
        .select("id")
        .limit(1)

      result.serviceRoleAccess = {
        data: serviceData,
        error: serviceError?.message || null,
        errorCode: serviceError?.code || null,
      }
    } catch (error) {
      result.serviceRoleAccess = { error: String(error) }
    }

    // Test 8: Check current user's role and permissions
    try {
      const { data: roleData, error: roleError } = await supabase.rpc("exec_sql", {
        sql: `
          SELECT 
            current_user as current_user,
            session_user as session_user,
            current_role as current_role,
            has_table_privilege('public.user_sessions', 'SELECT') as can_select,
            has_table_privilege('public.user_sessions', 'INSERT') as can_insert,
            has_table_privilege('public.user_sessions', 'UPDATE') as can_update,
            has_table_privilege('public.user_sessions', 'DELETE') as can_delete;
        `,
      })

      result.userPermissions = {
        data: roleData,
        error: roleError?.message || null,
      }
    } catch (error) {
      result.userPermissions = { error: String(error) }
    }

    // Test 9: Check auth.uid() function
    try {
      const { data: authUidData, error: authUidError } = await supabase.rpc("exec_sql", {
        sql: "SELECT auth.uid() as auth_uid;",
      })

      result.authUid = {
        data: authUidData,
        error: authUidError?.message || null,
      }
    } catch (error) {
      result.authUid = { error: String(error) }
    }

    // Test 10: Try to count rows in the table
    try {
      const { count, error: countError } = await supabase
        .from("user_sessions")
        .select("*", { count: "exact", head: true })

      result.rowCount = {
        count: count,
        error: countError?.message || null,
        errorCode: countError?.code || null,
      }
    } catch (error) {
      result.rowCount = { error: String(error) }
    }

    return result
  } catch (error) {
    console.error("Comprehensive debug error:", error)
    return { success: false, error: String(error) }
  }
}

export async function testTableAccess() {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Not authenticated" }
    }

    // Try different ways to access the table
    const tests = []

    // Test 1: Basic select
    try {
      const { data, error } = await supabase.from("user_sessions").select("*").limit(1)
      tests.push({
        name: "Basic select",
        success: !error,
        data: data,
        error: error?.message,
        errorCode: error?.code,
      })
    } catch (error) {
      tests.push({
        name: "Basic select",
        success: false,
        error: String(error),
      })
    }

    // Test 2: Select with user filter
    try {
      const { data, error } = await supabase.from("user_sessions").select("*").eq("user_id", userData.user.id).limit(1)
      tests.push({
        name: "Select with user filter",
        success: !error,
        data: data,
        error: error?.message,
        errorCode: error?.code,
      })
    } catch (error) {
      tests.push({
        name: "Select with user filter",
        success: false,
        error: String(error),
      })
    }

    // Test 3: Count query
    try {
      const { count, error } = await supabase
        .from("user_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userData.user.id)
      tests.push({
        name: "Count query",
        success: !error,
        count: count,
        error: error?.message,
        errorCode: error?.code,
      })
    } catch (error) {
      tests.push({
        name: "Count query",
        success: false,
        error: String(error),
      })
    }

    // Test 4: Insert test (we'll rollback)
    try {
      const { data, error } = await supabase
        .from("user_sessions")
        .insert({
          user_id: userData.user.id,
          session_token: "test-token-" + Date.now(),
          ip_address: "127.0.0.1",
          user_agent: "test",
          device_type: "desktop",
          browser: "test",
          os: "test",
        })
        .select()

      if (!error && data) {
        // Clean up the test record
        await supabase.from("user_sessions").delete().eq("id", data[0].id)
      }

      tests.push({
        name: "Insert test",
        success: !error,
        data: data,
        error: error?.message,
        errorCode: error?.code,
      })
    } catch (error) {
      tests.push({
        name: "Insert test",
        success: false,
        error: String(error),
      })
    }

    return {
      success: true,
      userId: userData.user.id,
      tests: tests,
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// Add the missing export
export async function comprehensiveDebugAction() {
  return await comprehensiveDebug()
}
