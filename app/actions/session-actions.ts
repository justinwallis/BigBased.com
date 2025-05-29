"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { neon } from "@neondatabase/serverless"
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
    const sql = neon(process.env.NEON_DATABASE_URL!)

    // Get the current user using Supabase auth
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
      // Check if session already exists in Neon
      const existingSessions = await sql`
        SELECT * FROM public.user_sessions 
        WHERE session_token = ${session.access_token}
      `

      if (existingSessions.length > 0) {
        // Update last activity
        await sql`
          UPDATE public.user_sessions 
          SET last_activity = NOW(), ip_address = ${ipAddress}, user_agent = ${userAgent}
          WHERE session_token = ${session.access_token}
        `
        console.log("trackSession: Updated existing session")
      } else {
        // Create new session record
        await sql`
          INSERT INTO public.user_sessions (
            user_id, session_token, ip_address, user_agent, device_type, browser, os, expires_at
          ) VALUES (
            ${userData.user.id}, 
            ${session.access_token}, 
            ${ipAddress}, 
            ${userAgent}, 
            ${deviceType}, 
            ${browser}, 
            ${os}, 
            ${new Date(session.expires_at! * 1000).toISOString()}
          )
        `
        console.log("trackSession: Created new session")
      }

      return { success: true, tableExists: true }
    } catch (error) {
      console.error("trackSession: Database error:", error)
      if (String(error).includes("does not exist")) {
        return { success: false, error: "Table does not exist", tableExists: false }
      }
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
    const sql = neon(process.env.NEON_DATABASE_URL!)

    // Get the current user using Supabase auth
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
      // Get all sessions for the user from Neon
      const sessions = await sql`
        SELECT * FROM public.user_sessions 
        WHERE user_id = ${userData.user.id}
        ORDER BY last_activity DESC
      `

      // Mark current session
      const sessionsWithCurrent = sessions.map((s) => ({
        ...s,
        is_current: s.session_token === session.access_token,
      }))

      return {
        success: true,
        data: sessionsWithCurrent,
        tableExists: true,
      }
    } catch (error) {
      console.error("getUserSessions: Database error:", error)
      if (String(error).includes("does not exist")) {
        return { success: false, error: "The user_sessions table doesn't exist", tableExists: false }
      }
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
    const sql = neon(process.env.NEON_DATABASE_URL!)

    // Get the current user using Supabase auth
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
      const sessionsToRevoke = await sql`
        SELECT * FROM public.user_sessions 
        WHERE id = ${sessionId} AND user_id = ${userData.user.id}
      `

      if (sessionsToRevoke.length === 0) {
        return { success: false, error: "Session not found" }
      }

      const sessionToRevoke = sessionsToRevoke[0]

      // Don't allow revoking current session
      if (sessionToRevoke.session_token === session.access_token) {
        return { success: false, error: "Cannot revoke current session" }
      }

      // Delete the session record
      await sql`
        DELETE FROM public.user_sessions 
        WHERE id = ${sessionId} AND user_id = ${userData.user.id}
      `

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
    const sql = neon(process.env.NEON_DATABASE_URL!)

    // Get the current user using Supabase auth
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
      const sessionsToRevoke = await sql`
        SELECT COUNT(*) as count FROM public.user_sessions 
        WHERE user_id = ${userData.user.id} AND session_token != ${session.access_token}
      `

      const count = Number.parseInt(sessionsToRevoke[0].count)

      // Delete all other sessions
      await sql`
        DELETE FROM public.user_sessions 
        WHERE user_id = ${userData.user.id} AND session_token != ${session.access_token}
      `

      // Log the event using async functions
      try {
        const authEvents = await AUTH_EVENTS()
        const authStatus = await AUTH_STATUS()

        await logAuthEvent(userData.user.id, authEvents.LOGOUT, authStatus.SUCCESS, {
          action: "revoke_all_other_sessions",
          sessions_revoked: count,
        })
      } catch (logError) {
        // Ignore logging errors
        console.warn("Failed to log auth event:", logError)
      }

      return { success: true, revokedCount: count }
    } catch (error) {
      console.error("Error revoking all sessions:", error)
      return { success: false, error: "Failed to revoke sessions" }
    }
  } catch (error) {
    console.error("Error in revokeAllOtherSessions:", error)
    return { success: false, error: "Failed to revoke sessions" }
  }
}
