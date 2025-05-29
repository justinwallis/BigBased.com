"use server"

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

    // For now, return mock data since we don't have the user_sessions table set up
    // In production, this would query the actual database
    const mockSessions = [
      {
        id: "current-session",
        user_id: session.user.id,
        session_token: session.access_token,
        device_info: "Chrome on Windows 11",
        ip_address: "192.168.1.100",
        location: "New York, NY",
        user_agent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
        is_current: true,
        status: "active",
      },
      {
        id: "mobile-session",
        user_id: session.user.id,
        session_token: "mobile-token",
        device_info: "Safari on iPhone 15",
        ip_address: "10.0.0.50",
        location: "San Francisco, CA",
        user_agent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        last_active: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        is_current: false,
        status: "active",
      },
      {
        id: "old-session",
        user_id: session.user.id,
        session_token: "old-token",
        device_info: "Firefox on Ubuntu",
        ip_address: "203.0.113.45",
        location: "Austin, TX",
        user_agent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0",
        created_at: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
        last_active: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        is_current: false,
        status: "expired",
      },
    ]

    return {
      success: true,
      sessions: mockSessions,
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

    // Mock revocation for now - in production this would update the database
    console.log(`Revoking session ${sessionId} for user ${session.user.id}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

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

    // Mock revocation for now - in production this would update the database
    console.log(`Revoking all other sessions for user ${session.user.id}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return { success: true, revokedCount: 2 }
  } catch (error) {
    console.error("Error in revokeAllOtherSessions:", error)
    return { success: false, error: "Failed to revoke sessions" }
  }
}
