"use server"

import { neon } from "@neondatabase/serverless"

export async function createUserSessionsTableInNeon() {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL!)

    // Create the user_sessions table in Neon using proper tagged template syntax
    await sql`
      CREATE TABLE IF NOT EXISTS public.user_sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL,
        session_token TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        location TEXT,
        device_type TEXT DEFAULT 'desktop',
        browser TEXT DEFAULT 'unknown',
        os TEXT DEFAULT 'unknown',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_activity TIMESTAMPTZ DEFAULT NOW(),
        expires_at TIMESTAMPTZ,
        UNIQUE(session_token)
      )
    `

    // Create indexes for faster queries
    await sql`CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON public.user_sessions(session_token)`
    await sql`CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON public.user_sessions(last_activity)`

    // Test if the table was created successfully
    const testResult = await sql`SELECT COUNT(*) as count FROM public.user_sessions`

    return {
      success: true,
      message: "Table created successfully in Neon database",
      testResult: testResult[0],
    }
  } catch (error) {
    return {
      success: false,
      error: String(error),
      details: error,
    }
  }
}

export async function debugNeonConnection() {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL!)

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      tests: [] as any[],
    }

    // Test 1: Basic connection
    try {
      const dbInfo = await sql`SELECT current_database(), current_user, version()`
      result.tests.push({
        name: "Database connection",
        success: true,
        data: dbInfo[0],
      })
    } catch (err) {
      result.tests.push({
        name: "Database connection",
        success: false,
        error: String(err),
      })
    }

    // Test 2: List tables
    try {
      const tables = await sql`
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `
      result.tests.push({
        name: "List public tables",
        success: true,
        data: tables,
      })
    } catch (err) {
      result.tests.push({
        name: "List public tables",
        success: false,
        error: String(err),
      })
    }

    // Test 3: Check if user_sessions table exists
    try {
      const tableExists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'user_sessions'
        ) as exists
      `
      result.tests.push({
        name: "Check user_sessions table",
        success: true,
        data: tableExists[0],
      })
    } catch (err) {
      result.tests.push({
        name: "Check user_sessions table",
        success: false,
        error: String(err),
      })
    }

    // Test 4: Try to query user_sessions if it exists
    try {
      const sessionCount = await sql`SELECT COUNT(*) as count FROM public.user_sessions`
      result.tests.push({
        name: "Query user_sessions table",
        success: true,
        data: sessionCount[0],
      })
    } catch (err) {
      result.tests.push({
        name: "Query user_sessions table",
        success: false,
        error: String(err),
      })
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: String(error),
      timestamp: new Date().toISOString(),
    }
  }
}

export async function testNeonSessionOperations(userId: string) {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL!)

    const result = {
      success: true,
      userId,
      timestamp: new Date().toISOString(),
      tests: [] as any[],
    }

    // Test 1: Insert a test session
    try {
      const sessionToken = `test-session-${Date.now()}`
      const insertResult = await sql`
        INSERT INTO public.user_sessions (user_id, session_token, ip_address, user_agent, device_type, browser, os)
        VALUES (${userId}, ${sessionToken}, '127.0.0.1', 'Test Browser', 'desktop', 'Test', 'Test OS')
        RETURNING id, session_token
      `
      result.tests.push({
        name: "Insert test session",
        success: true,
        data: insertResult[0],
      })

      // Test 2: Query the session back
      const sessionId = insertResult[0].id
      const queryResult = await sql`
        SELECT * FROM public.user_sessions WHERE id = ${sessionId}
      `
      result.tests.push({
        name: "Query test session",
        success: true,
        data: queryResult[0],
      })

      // Test 3: Update the session
      const updateResult = await sql`
        UPDATE public.user_sessions 
        SET last_activity = NOW(), location = 'Test Location'
        WHERE id = ${sessionId}
        RETURNING id, last_activity, location
      `
      result.tests.push({
        name: "Update test session",
        success: true,
        data: updateResult[0],
      })

      // Test 4: Delete the test session
      const deleteResult = await sql`
        DELETE FROM public.user_sessions WHERE id = ${sessionId}
        RETURNING id
      `
      result.tests.push({
        name: "Delete test session",
        success: true,
        data: deleteResult[0],
      })
    } catch (err) {
      result.tests.push({
        name: "Session operations",
        success: false,
        error: String(err),
      })
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: String(error),
      timestamp: new Date().toISOString(),
    }
  }
}
