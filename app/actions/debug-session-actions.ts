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

    // Test table access
    const { data: testQuery, error: testError } = await supabase.from("user_sessions").select("id").limit(1)

    console.log("Table test - Data:", testQuery, "Error:", testError)

    if (testError) {
      return {
        success: false,
        error: `Table access failed: ${testError.message}`,
        tableExists: false,
      }
    }

    // Try to track session
    const trackResult = await trackSession()
    console.log("Track session result:", trackResult)

    // Try to get sessions
    const sessionsResult = await getUserSessions()
    console.log("Get sessions result:", sessionsResult)

    return {
      success: true,
      trackResult,
      sessionsResult,
      tableExists: true,
    }
  } catch (error) {
    console.error("Debug session tracking error:", error)
    return {
      success: false,
      error: `Debug failed: ${error}`,
    }
  }
}
