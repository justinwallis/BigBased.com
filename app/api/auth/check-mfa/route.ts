import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 })
    }

    // Create service role client
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get user by email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email)

    if (userError || !userData.user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Check MFA status
    const { data: mfaData, error: mfaError } = await supabase
      .from("mfa_settings")
      .select("mfa_enabled, mfa_type")
      .eq("id", userData.user.id)
      .single()

    if (mfaError) {
      return NextResponse.json(
        {
          success: true,
          data: {
            enabled: false,
            type: null,
          },
        },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          enabled: mfaData?.mfa_enabled || false,
          type: mfaData?.mfa_type || null,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error checking MFA status:", error)
    return NextResponse.json({ success: false, error: "Failed to check MFA status" }, { status: 500 })
  }
}
