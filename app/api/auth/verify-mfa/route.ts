import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verify-token"

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    console.log("=== MFA Verify API called ===")
    console.log("Email:", email)
    console.log("Token provided:", !!token)

    if (!email || !token) {
      return NextResponse.json({ success: false, error: "Email and token are required" }, { status: 400 })
    }

    // Use service role client
    const supabase = createServerSupabaseClient(true)

    // Get user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      console.error("Error listing users:", userError)
      return NextResponse.json({ success: false, error: "Failed to check user" }, { status: 500 })
    }

    const user = userData.users.find((u) => u.email === email)

    if (!user) {
      console.log("User not found with email:", email)
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    console.log("Found user with ID:", user.id)

    // First, let's check if the mfa_settings table exists and what columns it has
    const { data: tableInfo, error: tableError } = await supabase.from("mfa_settings").select("*").limit(1)

    console.log("Table check result:", { tableInfo, tableError })

    // Get MFA settings - use the correct column name: authenticator_secret
    const { data: mfaData, error: mfaError } = await supabase.from("mfa_settings").select("*").eq("id", user.id)

    console.log("MFA query result:", {
      hasData: !!mfaData,
      dataLength: mfaData?.length,
      mfaData: mfaData,
      error: mfaError,
    })

    if (mfaError) {
      console.log("Error querying MFA settings:", mfaError)
      return NextResponse.json({ success: false, error: "MFA not set up" }, { status: 400 })
    }

    if (!mfaData || mfaData.length === 0) {
      console.log("No MFA settings found for user")
      return NextResponse.json({ success: false, error: "MFA not set up" }, { status: 400 })
    }

    const mfaSettings = mfaData[0]
    console.log("MFA settings found:", {
      mfaEnabled: mfaSettings.mfa_enabled,
      mfaType: mfaSettings.mfa_type,
      hasSecret: !!mfaSettings.authenticator_secret,
    })

    if (!mfaSettings.mfa_enabled) {
      console.log("MFA not enabled for user")
      return NextResponse.json({ success: false, error: "MFA not enabled" }, { status: 400 })
    }

    // Verify TOTP token using our utility function
    if (mfaSettings.authenticator_secret) {
      console.log("Verifying TOTP token with secret")
      const isValid = verifyToken(mfaSettings.authenticator_secret, token)

      console.log("TOTP verification result:", isValid)

      if (isValid) {
        return NextResponse.json({ success: true }, { status: 200 })
      }
    } else {
      console.log("No authenticator secret found")
    }

    console.log("Invalid MFA token")
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 400 })
  } catch (error) {
    console.error("Error verifying MFA:", error)
    return NextResponse.json({ success: false, error: "Failed to verify MFA" }, { status: 500 })
  }
}
