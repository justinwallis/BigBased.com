import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    console.log("=== MFA Check API called ===")
    console.log("Email:", email)

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log("Environment check:", {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!serviceRoleKey,
    })

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

    console.log("Getting user by email...")
    // Get user by email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email)

    console.log("User lookup result:", {
      hasUser: !!userData?.user,
      userId: userData?.user?.id,
      error: userError?.message,
    })

    if (userError || !userData.user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    console.log("Checking MFA settings for user:", userData.user.id)
    // Check MFA status
    const { data: mfaData, error: mfaError } = await supabase
      .from("mfa_settings")
      .select("mfa_enabled, mfa_type")
      .eq("id", userData.user.id)
      .maybeSingle()

    console.log("MFA settings result:", {
      data: mfaData,
      error: mfaError,
    })

    if (mfaError || !mfaData) {
      console.log("No MFA settings found, returning disabled")
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

    const result = {
      enabled: mfaData?.mfa_enabled || false,
      type: mfaData?.mfa_type || null,
    }

    console.log("Returning MFA status:", result)

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error checking MFA status:", error)
    return NextResponse.json({ success: false, error: "Failed to check MFA status" }, { status: 500 })
  }
}
