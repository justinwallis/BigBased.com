"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

interface Session {
  id: string
  user_id: string
  session_token: string
  device_info: string
  ip_address: string
  location: string
  user_agent: string
  created_at: string
  last_active: string
  is_current: boolean
  status: "active" | "expired" | "revoked"
}

interface SessionResult {
  success: boolean
  sessions?: Session[]
  error?: string
}

interface RevokeResult {
  success: boolean
  error?: string
}

export async function getUserSessions(): Promise<SessionResult> {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: "User not authenticated",
      }
    }

    // Mock session data for now - replace with actual database query
    const mockSessions: Session[] = [
      {
        id: "current-session",
        user_id: user.id,
        session_token: "current-token",
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
        user_id: user.id,
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
        user_id: user.id,
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
    console.error("Error fetching sessions:", error)
    return {
      success: false,
      error: "Failed to fetch sessions",
    }
  }
}

export async function revokeSession(sessionId: string): Promise<RevokeResult> {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: "User not authenticated",
      }
    }

    // Mock revocation - replace with actual database update
    console.log(`Revoking session ${sessionId} for user ${user.id}`)

    // In a real implementation, you would:
    // 1. Update the session status to 'revoked' in the database
    // 2. Invalidate the session token
    // 3. Optionally notify the user via email

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Revalidate the sessions page
    revalidatePath("/profile/security/sessions")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error revoking session:", error)
    return {
      success: false,
      error: "Failed to revoke session",
    }
  }
}

export async function revokeAllOtherSessions(): Promise<RevokeResult> {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: "User not authenticated",
      }
    }

    // Mock revocation of all other sessions
    console.log(`Revoking all other sessions for user ${user.id}`)

    // In a real implementation, you would:
    // 1. Update all non-current sessions to 'revoked' status
    // 2. Invalidate all other session tokens
    // 3. Keep only the current session active

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Revalidate the sessions page
    revalidatePath("/profile/security/sessions")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error revoking all sessions:", error)
    return {
      success: false,
      error: "Failed to revoke all sessions",
    }
  }
}
