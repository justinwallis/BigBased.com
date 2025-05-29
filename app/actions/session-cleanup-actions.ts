"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { neon } from "@neondatabase/serverless"

// Clean up expired and invalid sessions
export async function cleanupExpiredSessions() {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL!)

    // Delete expired sessions
    const result = await sql`
      DELETE FROM public.user_sessions 
      WHERE expires_at < NOW()
    `

    console.log("Cleaned up expired sessions:", result)
    return { success: true, cleaned: result.length }
  } catch (error) {
    console.error("Error cleaning up sessions:", error)
    return { success: false, error: "Failed to cleanup sessions" }
  }
}

// Clean up sessions for a specific user when they sign out
export async function cleanupUserSessions(userId: string, currentSessionToken?: string) {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL!)

    if (currentSessionToken) {
      // Remove only the current session
      await sql`
        DELETE FROM public.user_sessions 
        WHERE user_id = ${userId} AND session_token = ${currentSessionToken}
      `
    } else {
      // Remove all sessions for the user
      await sql`
        DELETE FROM public.user_sessions 
        WHERE user_id = ${userId}
      `
    }

    return { success: true }
  } catch (error) {
    console.error("Error cleaning up user sessions:", error)
    return { success: false, error: "Failed to cleanup user sessions" }
  }
}

// Validate and clean invalid sessions
export async function validateAndCleanSessions() {
  try {
    const supabase = createServerSupabaseClient()
    const sql = neon(process.env.NEON_DATABASE_URL!)

    // Get all sessions from Neon
    const sessions = await sql`
      SELECT session_token, user_id FROM public.user_sessions
    `

    const invalidTokens: string[] = []

    // Check each session token with Supabase
    for (const session of sessions) {
      try {
        const { data, error } = await supabase.auth.getUser(session.session_token)
        if (error || !data.user) {
          invalidTokens.push(session.session_token)
        }
      } catch {
        invalidTokens.push(session.session_token)
      }
    }

    // Remove invalid sessions
    if (invalidTokens.length > 0) {
      await sql`
        DELETE FROM public.user_sessions 
        WHERE session_token = ANY(${invalidTokens})
      `
    }

    return { success: true, cleaned: invalidTokens.length }
  } catch (error) {
    console.error("Error validating sessions:", error)
    return { success: false, error: "Failed to validate sessions" }
  }
}
