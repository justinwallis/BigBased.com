"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { logAuthEvent, AUTH_EVENTS, AUTH_STATUS } from "./auth-log-actions"

// Helper function to parse user agent
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase()

  // Detect device type
  let deviceType = "desktop"
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    deviceType = "mobile"
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    deviceType = "tablet"
  }

  // Detect browser
  let browser = "Unknown"
  if (ua.includes("chrome") && !ua.includes("edg")) {
    browser = "Chrome"
  } else if (ua.includes("firefox")) {
    browser = "Firefox"
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "Safari"
  } else if (ua.includes("edg")) {
    browser = "Edge"
  } else if (ua.includes("opera")) {
    browser = "Opera"
  }

  // Detect OS
  let os = "Unknown"
  if (ua.includes("windows")) {
    os = "Windows"
  } else if (ua.includes("mac")) {
    os = "macOS"
  } else if (ua.includes("linux")) {
    os = "Linux"
  } else if (ua.includes("android")) {
    os = "Android"
  } else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) {
    os = "iOS"
  }

  return { deviceType, browser, os }
}

// Create or update session tracking
export async function trackSession() {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user using the more secure getUser method
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      console.log("trackSession: No authenticated user")
      return { success: false, error: "Not authenticated" }
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const session = sessionData.session

    if (!session) {
      console.log("trackSession: No active session")
      return { success: false, error: "No active session" }
    }

    // Get request headers
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Parse user agent
    const { deviceType, browser, os } = parseUserAgent(userAgent)

    try {
      // First, test if we can access the table
      const { data: testQuery, error: testError } = await supabase.from("user_sessions").select("id").limit(1)

      if (testError) {
        console.error("trackSession: Table access error:", testError)
        if (
          testError.code === "42P01" ||
          testError.message?.includes("relation") ||
          testError.message?.includes("does not exist")
        ) {
          return { success: false, error: "Table does not exist", tableExists: false }
        }
        return { success: false, error: testError.message }
      }

      // Check if session already exists
      const { data: existingSession, error: queryError } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("session_token", session.access_token)
        .single()

      if (queryError && queryError.code !== "PGRST116") {
        // PGRST116 is "not found" which is expected for new sessions
        console.error("trackSession: Query error:", queryError)
        return { success: false, error: queryError.message }
      }

      if (existingSession) {
        // Update last activity
        const { error } = await supabase
          .from("user_sessions")
          .update({
            last_activity: new Date().toISOString(),
            ip_address: ipAddress,
            user_agent: userAgent,
          })
          .eq("id", existingSession.id)

        if (error) {
          console.error("trackSession: Update error:", error)
          return { success: false, error: error.message }
        }

        console.log("trackSession: Updated existing session")
      } else {
        // Create new session record
        const { error } = await supabase.from("user_sessions").insert({
          user_id: userData.user.id,
          session_token: session.access_token,
          ip_address: ipAddress,
          user_agent: userAgent,
          device_type: deviceType,
          browser: browser,
          os: os,
          created_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
          expires_at: new Date(session.expires_at! * 1000).toISOString(),
        })

        if (error) {
          console.error("trackSession: Insert error:", error)
          return { success: false, error: error.message }
        }

        console.log("trackSession: Created new session")
      }

      return { success: true, tableExists: true }
    } catch (error) {
      console.error("trackSession: Database error:", error)
      return { success: false, error: "Database operation failed" }
    }
  } catch (error) {
    console.error("trackSession: General error:", error)
    return { success: false, error: "Failed to track session" }
  }
}

// Get user sessions
export async function getUserSessions() {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user using the more secure getUser method
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const session = sessionData.session

    if (!session) {
      return { success: false, error: "No active session" }
    }

    try {
      // First, test if we can access the table
      const { data: testQuery, error: testError } = await supabase.from("user_sessions").select("id").limit(1)

      if (testError) {
        console.error("getUserSessions: Table access error:", testError)
        if (
          testError.code === "42P01" ||
          testError.message?.includes("relation") ||
          testError.message?.includes("does not exist")
        ) {
          return { success: false, error: "The user_sessions table doesn't exist", tableExists: false }
        }
        return { success: false, error: testError.message }
      }

      // Get all sessions for the user
      const { data: sessions, error } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("last_activity", { ascending: false })

      if (error) {
        console.error("getUserSessions: Query error:", error)
        return { success: false, error: error.message }
      }

      // Mark current session
      const sessionsWithCurrent =
        sessions?.map((s) => ({
          ...s,
          is_current: s.session_token === session.access_token,
        })) || []

      return {
        success: true,
        data: sessionsWithCurrent,
        tableExists: true,
      }
    } catch (error) {
      console.error("getUserSessions: Database error:", error)
      return { success: false, error: "Database operation failed" }
    }
  } catch (error) {
    console.error("getUserSessions: General error:", error)
    return { success: false, error: "Failed to fetch sessions" }
  }
}

// Revoke a specific session
export async function revokeSession(sessionId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user using the more secure getUser method
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const session = sessionData.session

    if (!session) {
      return { success: false, error: "No active session" }
    }

    try {
      // Get the session to revoke
      const { data: sessionToRevoke, error: fetchError } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", userData.user.id)
        .single()

      if (fetchError) {
        // If the error is because the table doesn't exist, return an error
        if (fetchError.code === "42P01") {
          return { success: false, error: "The user_sessions table doesn't exist" }
        }

        return { success: false, error: "Session not found" }
      }

      if (!sessionToRevoke) {
        return { success: false, error: "Session not found" }
      }

      // Don't allow revoking current session
      if (sessionToRevoke.session_token === session.access_token) {
        return { success: false, error: "Cannot revoke current session" }
      }

      // Delete the session record
      const { error } = await supabase
        .from("user_sessions")
        .delete()
        .eq("id", sessionId)
        .eq("user_id", userData.user.id)

      if (error) {
        console.error("Error revoking session:", error)
        return { success: false, error: error.message }
      }

      // Log the event using async functions
      try {
        const authEvents = await AUTH_EVENTS()
        const authStatus = await AUTH_STATUS()

        await logAuthEvent(userData.user.id, authEvents.LOGOUT, authStatus.SUCCESS, {
          revoked_session_id: sessionId,
          device_type: sessionToRevoke.device_type,
          browser: sessionToRevoke.browser,
          ip_address: sessionToRevoke.ip_address,
        })
      } catch (logError) {
        // Ignore logging errors
        console.warn("Failed to log auth event:", logError)
      }

      return { success: true }
    } catch (error) {
      console.error("Error revoking session:", error)
      return { success: false, error: "Failed to revoke session" }
    }
  } catch (error) {
    console.error("Error in revokeSession:", error)
    return { success: false, error: "Failed to revoke session" }
  }
}

// Revoke all other sessions (keep current)
export async function revokeAllOtherSessions() {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user using the more secure getUser method
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const session = sessionData.session

    if (!session) {
      return { success: false, error: "No active session" }
    }

    try {
      // Get count of sessions to revoke
      const { count, error: countError } = await supabase
        .from("user_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userData.user.id)
        .neq("session_token", session.access_token)

      if (countError) {
        // If the error is because the table doesn't exist, return success with 0 revoked
        if (countError.code === "42P01") {
          return { success: true, revokedCount: 0 }
        }

        console.error("Error counting sessions:", countError)
        return { success: false, error: countError.message }
      }

      // Delete all other sessions
      const { error } = await supabase
        .from("user_sessions")
        .delete()
        .eq("user_id", userData.user.id)
        .neq("session_token", session.access_token)

      if (error) {
        console.error("Error revoking all sessions:", error)
        return { success: false, error: error.message }
      }

      // Log the event using async functions
      try {
        const authEvents = await AUTH_EVENTS()
        const authStatus = await AUTH_STATUS()

        await logAuthEvent(userData.user.id, authEvents.LOGOUT, authStatus.SUCCESS, {
          action: "revoke_all_other_sessions",
          sessions_revoked: count || 0,
        })
      } catch (logError) {
        // Ignore logging errors
        console.warn("Failed to log auth event:", logError)
      }

      return { success: true, revokedCount: count || 0 }
    } catch (error) {
      console.error("Error revoking all sessions:", error)
      return { success: false, error: "Failed to revoke sessions" }
    }
  } catch (error) {
    console.error("Error in revokeAllOtherSessions:", error)
    return { success: false, error: "Failed to revoke sessions" }
  }
}
