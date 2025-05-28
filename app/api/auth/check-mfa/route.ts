import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    console.log("=== MFA Check API called ===")
    console.log("Email:", email)

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Use service role client to access admin functions
    const supabase = createServerSupabaseClient(true)

    console.log("Getting user by email...")

    // Get user by email using admin API
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      console.error("Error listing users:", userError)
      return NextResponse.json({ success: false, error: "Failed to check user" }, { status: 500 })
    }

    // Find user by email
    const user = userData.users.find((u) => u.email === email)

    console.log("User lookup result:", {
      hasUser: !!user,
      userId: user?.id,
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    console.log("Checking MFA settings for user:", user.id)

    // Check MFA status
    const { data: mfaData, error: mfaError } = await supabase
      .from("mfa_settings")
      .select("mfa_enabled, mfa_type")
      .eq("id", user.id)
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
