"use server"

import { neon } from "@neondatabase/serverless"

export async function cleanupUserSessions(userId: string, currentToken: string) {
  try {
    console.log("Cleaning up sessions for user:", userId)
    console.log("Current token:", currentToken ? "Present (hidden)" : "Missing")

    // Connect to Neon database
    const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "")

    // First, try to find the session by token
    const result = await sql`
      DELETE FROM user_sessions 
      WHERE user_id = ${userId} 
      AND session_token = ${currentToken}
      RETURNING id
    `

    console.log(`Cleaned up ${result.length} sessions`)

    return { success: true, count: result.length }
  } catch (error) {
    console.error("Error cleaning up sessions:", error)
    return { success: false, error: error.message }
  }
}

export async function cleanupExpiredSessions() {
  try {
    // Connect to Neon database
    const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "")

    // Delete expired sessions
    const now = new Date().toISOString()
    const result = await sql`
      DELETE FROM user_sessions 
      WHERE expires_at < ${now}
      RETURNING id
    `

    console.log(`Cleaned up ${result.length} expired sessions`)

    return { success: true, count: result.length }
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error)
    return { success: false, error: error.message }
  }
}
