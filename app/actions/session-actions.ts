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

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    // Get request headers
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Parse user agent
    const { deviceType, browser, os } = parseUserAgent(userAgent)

    // Check if session already exists
    const { data: existingSession } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("session_token", session.access_token)
      .single()

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
        console.error("Error updating session:", error)
      }
    } else {
      // Create new session record
      const { error } = await supabase.from("user_sessions").insert({
        user_id: session.user.id,
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
        console.error("Error creating session:", error)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in trackSession:", error)
    return { success: false, error: "Failed to track session" }
  }
}

// Get user sessions
export async function getUserSessions() {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    // Get all sessions for the user
    const { data: sessions, error } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("user_id", session.user.id)
      .order("last_activity", { ascending: false })

    if (error) {
      console.error("Error fetching sessions:", error)
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
    }
  } catch (error) {
    console.error("Error in getUserSessions:", error)
    return { success: false, error: "Failed to fetch sessions" }
  }
}

// Revoke a specific session
export async function revokeSession(sessionId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    // Get the session to revoke
    const { data: sessionToRevoke, error: fetchError } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", session.user.id)
      .single()

    if (fetchError || !sessionToRevoke) {
      return { success: false, error: "Session not found" }
    }

    // Don't allow revoking current session
    if (sessionToRevoke.session_token === session.access_token) {
      return { success: false, error: "Cannot revoke current session" }
    }

    // Delete the session record
    const { error } = await supabase.from("user_sessions").delete().eq("id", sessionId).eq("user_id", session.user.id)

    if (error) {
      console.error("Error revoking session:", error)
      return { success: false, error: error.message }
    }

    // Log the event
    try {
      await logAuthEvent(session.user.id, AUTH_EVENTS.LOGOUT, AUTH_STATUS.SUCCESS, {
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
    console.error("Error in revokeSession:", error)
    return { success: false, error: "Failed to revoke session" }
  }
}

// Revoke all other sessions (keep current)
export async function revokeAllOtherSessions() {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    // Get count of sessions to revoke
    const { count } = await supabase
      .from("user_sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id)
      .neq("session_token", session.access_token)

    // Delete all other sessions
    const { error } = await supabase
      .from("user_sessions")
      .delete()
      .eq("user_id", session.user.id)
      .neq("session_token", session.access_token)

    if (error) {
      console.error("Error revoking all sessions:", error)
      return { success: false, error: error.message }
    }

    // Log the event
    try {
      await logAuthEvent(session.user.id, AUTH_EVENTS.LOGOUT, AUTH_STATUS.SUCCESS, {
        action: "revoke_all_other_sessions",
        sessions_revoked: count || 0,
      })
    } catch (logError) {
      // Ignore logging errors
      console.warn("Failed to log auth event:", logError)
    }

    return { success: true, revokedCount: count || 0 }
  } catch (error) {
    console.error("Error in revokeAllOtherSessions:", error)
    return { success: false, error: "Failed to revoke sessions" }
  }
}
