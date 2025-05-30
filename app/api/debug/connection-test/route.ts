import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createClient(false)

    // Test 1: Check which database we're connected to
    const { data: dbInfo, error: dbError } = await supabase.from("profiles").select("count(*)").limit(1)

    // Test 2: Try to get the actual database URL being used
    const envCheck = {
      supabaseUrl: process.env.SUPABASE_URL?.substring(0, 30) + "...",
      nextPublicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
      databaseUrl: process.env.DATABASE_URL?.substring(0, 30) + "...",
      neonUrl: process.env.NEON_DATABASE_URL?.substring(0, 30) + "...",
    }

    // Test 3: Try to query information_schema to see what columns exist
    const { data: columnInfo, error: columnError } = await supabase.rpc("sql", {
      query: `
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'profiles' 
          AND table_schema = 'public'
          ORDER BY ordinal_position
        `,
    })

    // Test 4: Try direct table structure query
    const { data: tableStructure, error: structureError } = await supabase.from("profiles").select("*").limit(0) // Get structure without data

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        dbConnection: {
          success: !dbError,
          data: dbInfo,
          error: dbError,
        },
        environmentUrls: envCheck,
        columnQuery: {
          success: !columnError,
          data: columnInfo,
          error: columnError,
        },
        tableStructure: {
          success: !structureError,
          error: structureError,
          // This will show us the actual columns the client sees
          columns: structureError ? null : "Check network tab for actual response",
        },
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  }
}
