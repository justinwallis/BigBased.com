"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function testSessionAccess() {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return {
        success: false,
        error: "Not authenticated",
        authStatus: "No user found",
      }
    }

    const userId = userData.user.id
    const results = {
      success: true,
      userId: userId,
      authStatus: "Authenticated",
      tests: [] as any[],
      serviceRoleTest: null as any,
    }

    // Test 1: Check if table exists
    try {
      const { error } = await supabase.from("user_sessions").select("id").limit(1)

      results.tests.push({
        name: "Table exists check",
        success: !error,
        error: error?.message,
        errorCode: error?.code,
      })
    } catch (error) {
      results.tests.push({
        name: "Table exists check",
        success: false,
        error: String(error),
      })
    }

    // Test 2: Try to insert a session with explicit user_id
    let testSessionId = null
    try {
      const { data, error } = await supabase
        .from("user_sessions")
        .insert({
          user_id: userId,
          session_token: `test-token-${Date.now()}`,
          ip_address: "127.0.0.1",
          user_agent: "Test Browser",
          device_type: "desktop",
          browser: "Test Browser",
          os: "Test OS",
        })
        .select()

      if (data && data.length > 0) {
        testSessionId = data[0].id
      }

      results.tests.push({
        name: "Insert session",
        success: !error && !!testSessionId,
        sessionId: testSessionId,
        error: error?.message,
        errorCode: error?.code,
      })
    } catch (error) {
      results.tests.push({
        name: "Insert session",
        success: false,
        error: String(error),
      })
    }

    // Test 3: Try to select the session we just inserted
    if (testSessionId) {
      try {
        const { data, error } = await supabase
          .from("user_sessions")
          .select("*")
          .eq("id", testSessionId)
          .eq("user_id", userId)
          .single()

        results.tests.push({
          name: "Select specific session",
          success: !error && !!data,
          data: data ? { id: data.id, user_id: data.user_id } : null,
          error: error?.message,
          errorCode: error?.code,
        })
      } catch (error) {
        results.tests.push({
          name: "Select specific session",
          success: false,
          error: String(error),
        })
      }
    }

    // Test 4: Try with service role
    try {
      const serviceSupabase = createServerSupabaseClient(true) // Use service role

      // First, check if table exists
      const { error: tableError } = await serviceSupabase.from("user_sessions").select("id").limit(1)

      if (!tableError) {
        // Try to insert a session
        const { data, error } = await serviceSupabase
          .from("user_sessions")
          .insert({
            user_id: userId,
            session_token: `service-role-test-${Date.now()}`,
            ip_address: "127.0.0.1",
            user_agent: "Service Role Test",
            device_type: "desktop",
            browser: "Service Role Browser",
            os: "Service Role OS",
          })
          .select()

        results.serviceRoleTest = {
          success: !error,
          data: data ? data[0]?.id : null,
          error: error?.message,
          errorCode: error?.code,
        }
      } else {
        results.serviceRoleTest = {
          success: false,
          error: tableError.message,
          errorCode: tableError.code,
        }
      }
    } catch (error) {
      results.serviceRoleTest = {
        success: false,
        error: String(error),
      }
    }

    // Test 5: Clean up - delete the test session if it exists
    if (testSessionId) {
      try {
        const { error } = await supabase.from("user_sessions").delete().eq("id", testSessionId)

        results.tests.push({
          name: "Delete test session",
          success: !error,
          error: error?.message,
          errorCode: error?.code,
        })
      } catch (error) {
        results.tests.push({
          name: "Delete test session",
          success: false,
          error: String(error),
        })
      }
    }

    return results
  } catch (error) {
    return {
      success: false,
      error: String(error),
    }
  }
}
