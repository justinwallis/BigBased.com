import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    console.log("=== DEBUGGING USER DATA ===")

    // Test 1: Check profiles table structure
    console.log("1. Checking profiles table...")
    const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").limit(5)

    console.log("Profiles result:", { profiles, profilesError })

    // Test 2: Check auth_logs table structure
    console.log("2. Checking auth_logs table...")
    const { data: authLogs, error: authLogsError } = await supabase.from("auth_logs").select("*").limit(5)

    console.log("Auth logs result:", { authLogs, authLogsError })

    // Test 3: Check admin_logs table
    console.log("3. Checking admin_logs table...")
    const { data: adminLogs, error: adminLogsError } = await supabase.from("admin_logs").select("*").limit(5)

    console.log("Admin logs result:", { adminLogs, adminLogsError })

    // Test 4: Try to get actual user count from auth.users (if accessible)
    console.log("4. Checking auth.users access...")
    const { count: authUsersCount, error: authCountError } = await supabase
      .from("auth.users")
      .select("*", { count: "exact", head: true })

    console.log("Auth users count:", { authUsersCount, authCountError })

    // Test 5: Check what tables we actually have access to
    console.log("5. Checking available tables...")
    const { data: tables, error: tablesError } = await supabase
      .rpc("get_table_names")
      .catch(() => ({ data: null, error: "RPC not available" }))

    console.log("Available tables:", { tables, tablesError })

    return NextResponse.json({
      success: true,
      debug: {
        profiles: { data: profiles, error: profilesError },
        authLogs: { data: authLogs, error: authLogsError },
        adminLogs: { data: adminLogs, error: adminLogsError },
        authUsersCount: { count: authUsersCount, error: authCountError },
        tables: { data: tables, error: tablesError },
      },
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
