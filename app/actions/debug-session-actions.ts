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

    // Check if table exists
    const { data: tableInfo, error: tableError } = await supabase.rpc("check_table_exists_simple", {
      table_name: "user_sessions",
    })

    console.log("Table exists check:", tableInfo, tableError?.message)

    // Try to access the table directly
    const { data: directTest, error: directError } = await supabase.from("user_sessions").select("id").limit(1)

    console.log("Direct table test - Data:", directTest, "Error:", directError)

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
      tableInfo,
      directTest: { data: directTest, error: directError?.message },
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

export async function manuallyCreateSession() {
  console.log("=== Manually Creating Session ===")

  try {
    const supabase = createServerSupabaseClient()

    // Check if user is authenticated
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const session = sessionData.session

    if (!session) {
      return { success: false, error: "No active session" }
    }

    // Try to insert a session record directly
    const { data, error } = await supabase
      .from("user_sessions")
      .insert({
        user_id: userData.user.id,
        session_token: session.access_token,
        ip_address: "127.0.0.1",
        user_agent: "Manual creation",
        device_type: "desktop",
        browser: "Manual",
        os: "Manual",
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        expires_at: new Date(session.expires_at! * 1000).toISOString(),
      })
      .select()

    console.log("Manual session creation result:", data, error)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Manual session creation error:", error)
    return { success: false, error: String(error) }
  }
}
