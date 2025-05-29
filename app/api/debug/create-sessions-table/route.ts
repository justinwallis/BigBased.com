import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

    if (!databaseUrl) {
      return NextResponse.json({
        success: false,
        error: "No DATABASE_URL or NEON_DATABASE_URL found in environment variables",
      })
    }

    const sql = neon(databaseUrl)

    // Create the user_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        session_token TEXT NOT NULL UNIQUE,
        ip_address TEXT,
        user_agent TEXT,
        device_type TEXT,
        browser TEXT,
        os TEXT,
        location TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE,
        CONSTRAINT fk_user_sessions_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
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

    // Verify table was created
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_sessions'
      ) as exists
    `

    const tableExists = tableCheck[0]?.exists || false

    return NextResponse.json({
      success: true,
      tableExists,
      message: "user_sessions table created successfully with indexes",
    })
  } catch (error) {
    console.error("Error creating sessions table:", error)

    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error occurred",
    })
  }
}
