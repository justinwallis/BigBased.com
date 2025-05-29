import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

    if (!databaseUrl) {
      return NextResponse.json({
        connectionStatus: "error",
        databaseUrl: "",
        tableExists: false,
        error: "No DATABASE_URL or NEON_DATABASE_URL found in environment variables",
        sessionCount: 0,
      })
    }

    // Create Neon SQL client
    const sql = neon(databaseUrl)

    // Test basic connection
    const testQuery = await sql`SELECT NOW() as current_time`

    // Check if user_sessions table exists
    let tableExists = false
    let sessionCount = 0

    try {
      const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'user_sessions'
        ) as exists
      `
      tableExists = tableCheck[0]?.exists || false

      if (tableExists) {
        const countResult = await sql`SELECT COUNT(*) as count FROM user_sessions`
        sessionCount = Number.parseInt(countResult[0]?.count || "0")
      }
    } catch (tableError) {
      console.error("Table check error:", tableError)
    }

    // Test session query structure
    let sessionStructure = null
    if (tableExists) {
      try {
        const structureResult = await sql`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = 'user_sessions' 
          ORDER BY ordinal_position
        `
        sessionStructure = structureResult
      } catch (structError) {
        console.error("Structure check error:", structError)
      }
    }

    return NextResponse.json({
      connectionStatus: "connected",
      databaseUrl: databaseUrl.substring(0, 50) + "...",
      tableExists,
      sessionCount,
      sessionStructure,
      testTime: testQuery[0]?.current_time,
      error: null,
    })
  } catch (error) {
    console.error("Neon debug error:", error)

    return NextResponse.json({
      connectionStatus: "error",
      databaseUrl: process.env.NEON_DATABASE_URL ? "Found" : "Missing",
      tableExists: false,
      error: error.message || "Unknown error occurred",
      sessionCount: 0,
    })
  }
}
