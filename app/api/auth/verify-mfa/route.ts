import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { authenticator } from "otplib"

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
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    console.log("Getting MFA settings for user:", user.id)

    // Get MFA settings - use the same columns as the check-mfa API
    const { data: mfaData, error: mfaError } = await supabase
      .from("mfa_settings")
      .select("mfa_enabled, mfa_type, mfa_secret, backup_codes")
      .eq("id", user.id)
      .single()

    console.log("MFA data retrieved:", {
      hasData: !!mfaData,
      mfaEnabled: mfaData?.mfa_enabled,
      mfaType: mfaData?.mfa_type,
      hasSecret: !!mfaData?.mfa_secret,
      hasBackupCodes: !!mfaData?.backup_codes,
      error: mfaError,
    })

    if (mfaError || !mfaData) {
      console.log("No MFA data found for user")
      return NextResponse.json({ success: false, error: "MFA not set up" }, { status: 400 })
    }

    // Check if MFA is enabled
    if (!mfaData.mfa_enabled) {
      console.log("MFA not enabled for user")
      return NextResponse.json({ success: false, error: "MFA not enabled" }, { status: 400 })
    }

    // Check if it's a backup code
    if (mfaData.backup_codes && Array.isArray(mfaData.backup_codes)) {
      const backupCodes = mfaData.backup_codes as string[]
      if (backupCodes.includes(token)) {
        console.log("Valid backup code used")

        // Remove the used backup code
        const updatedBackupCodes = backupCodes.filter((code) => code !== token)
        await supabase.from("mfa_settings").update({ backup_codes: updatedBackupCodes }).eq("id", user.id)

        return NextResponse.json({ success: true }, { status: 200 })
      }
    }

    // Verify TOTP token
    if (mfaData.mfa_secret) {
      console.log("Verifying TOTP token with secret")
      const isValid = authenticator.verify({
        token: token,
        secret: mfaData.mfa_secret,
        window: 2, // Allow 2 time steps before/after for clock drift
      })

      console.log("TOTP verification result:", isValid)

      if (isValid) {
        return NextResponse.json({ success: true }, { status: 200 })
      }
    } else {
      console.log("No MFA secret found")
    }

    console.log("Invalid MFA token")
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 400 })
  } catch (error) {
    console.error("Error verifying MFA:", error)
    return NextResponse.json({ success: false, error: "Failed to verify MFA" }, { status: 500 })
  }
}
