import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: NextRequest) {
  try {
    // Get database URL
    const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

    if (!databaseUrl) {
      return NextResponse.json({
        success: false,
        error: "No DATABASE_URL or NEON_DATABASE_URL environment variable found",
      })
    }

    const sql = neon(databaseUrl)

    // Create the user_sessions table with proper structure
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        session_token TEXT NOT NULL UNIQUE,
        ip_address INET,
        user_agent TEXT,
        device_type VARCHAR(50),
        browser VARCHAR(100),
        os VARCHAR(100),
        location TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMPTZ NOT NULL,
        CONSTRAINT unique_user_session UNIQUE(user_id, session_token)
      )
    `

    // Create indexes for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at)
    `

    // Clean up any expired sessions
    const cleanupResult = await sql`
      DELETE FROM user_sessions WHERE expires_at < NOW()
    `

    return NextResponse.json({
      success: true,
      message: "user_sessions table created successfully",
      cleanedExpired: cleanupResult.length,
    })
  } catch (error) {
    console.error("Error creating user_sessions table:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}
