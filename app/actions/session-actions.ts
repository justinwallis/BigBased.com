"use server"

import { neon } from "@neondatabase/serverless"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

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

// Get Neon SQL client
function getNeonClient() {
  const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("No DATABASE_URL or NEON_DATABASE_URL found")
  }
  return neon(databaseUrl)
}

// Create or update session tracking
export async function trackSession() {
  try {
    const supabase = createServerSupabaseClient()
    const sql = getNeonClient()

    // Get the current user from Supabase Auth
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "No session found" }
    }

    // Get request headers
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Parse user agent
    const { deviceType, browser, os } = parseUserAgent(userAgent)

    // Check if session already exists in Neon
    const existingSessions = await sql`
      SELECT * FROM user_sessions 
      WHERE session_token = ${session.access_token}
    `

    if (existingSessions.length > 0) {
      // Update last activity
      await sql`
        UPDATE user_sessions 
        SET 
          last_activity = NOW(),
          ip_address = ${ipAddress},
          user_agent = ${userAgent}
        WHERE session_token = ${session.access_token}
      `
    } else {
      // Create new session record
      await sql`
        INSERT INTO user_sessions (
          user_id, session_token, ip_address, user_agent, 
          device_type, browser, os, created_at, last_activity, expires_at
        ) VALUES (
          ${user.id}, ${session.access_token}, ${ipAddress}, ${userAgent},
          ${deviceType}, ${browser}, ${os}, NOW(), NOW(), 
          ${new Date(session.expires_at! * 1000).toISOString()}
        )
      `
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
    const sql = getNeonClient()

    // Get the current user from Supabase Auth
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "No session found" }
    }

    // Get all sessions for the user from Neon
    const sessions = await sql`
      SELECT * FROM user_sessions 
      WHERE user_id = ${user.id} 
      ORDER BY last_activity DESC
    `

    // Mark current session and format data
    const sessionsWithCurrent = sessions.map((s) => ({
      id: s.id,
      user_id: s.user_id,
      session_token: s.session_token,
      ip_address: s.ip_address,
      user_agent: s.user_agent,
      device_type: s.device_type,
      browser: s.browser,
      os: s.os,
      location: s.location,
      created_at: s.created_at,
      last_activity: s.last_activity,
      expires_at: s.expires_at,
      is_current: s.session_token === session.access_token,
    }))

    return {
      success: true,
      sessions: sessionsWithCurrent,
    }
  } catch (error) {
    console.error("Error in getUserSessions:", error)
    return { success: false, error: error.message || "Failed to fetch sessions" }
  }
}

// Revoke a specific session
export async function revokeSession(sessionId: string) {
  try {
    const supabase = createServerSupabaseClient()
    const sql = getNeonClient()

    // Get the current user from Supabase Auth
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "No session found" }
    }

    // Get the session to revoke from Neon
    const sessionsToRevoke = await sql`
      SELECT * FROM user_sessions 
      WHERE id = ${sessionId} AND user_id = ${user.id}
    `

    if (sessionsToRevoke.length === 0) {
      return { success: false, error: "Session not found" }
    }

    const sessionToRevoke = sessionsToRevoke[0]

    // Don't allow revoking current session
    if (sessionToRevoke.session_token === session.access_token) {
      return { success: false, error: "Cannot revoke current session" }
    }

    // Delete the session record from Neon
    await sql`
      DELETE FROM user_sessions 
      WHERE id = ${sessionId} AND user_id = ${user.id}
    `

    // Log the revocation
    console.log(`Session ${sessionId} revoked for user ${user.id}`)

    return { success: true }
  } catch (error) {
    console.error("Error in revokeSession:", error)
    return { success: false, error: error.message || "Failed to revoke session" }
  }
}

// Revoke all other sessions (keep current)
export async function revokeAllOtherSessions() {
  try {
    const supabase = createServerSupabaseClient()
    const sql = getNeonClient()

    // Get the current user from Supabase Auth
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "No session found" }
    }

    // Get count of sessions to revoke
    const countResult = await sql`
      SELECT COUNT(*) as count FROM user_sessions 
      WHERE user_id = ${user.id} AND session_token != ${session.access_token}
    `

    const count = Number.parseInt(countResult[0]?.count || "0")

    // Delete all other sessions from Neon
    await sql`
      DELETE FROM user_sessions 
      WHERE user_id = ${user.id} AND session_token != ${session.access_token}
    `

    // Log the revocation
    console.log(`All other sessions revoked for user ${user.id}, count: ${count}`)

    return { success: true, revokedCount: count }
  } catch (error) {
    console.error("Error in revokeAllOtherSessions:", error)
    return { success: false, error: error.message || "Failed to revoke sessions" }
  }
}
