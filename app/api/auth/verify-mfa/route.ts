import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { verifyToken } from "node-2fa"

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    if (!email || !token) {
      return NextResponse.json({ success: false, error: "Email and token are required" }, { status: 400 })
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

    // Get MFA secret
    const { data: mfaData, error: mfaError } = await supabase
      .from("mfa_settings")
      .select("authenticator_secret")
      .eq("id", userData.user.id)
      .single()

    if (mfaError || !mfaData?.authenticator_secret) {
      return NextResponse.json({ success: false, error: "MFA not set up" }, { status: 400 })
    }

    // Verify the token
    const verified = verifyToken(mfaData.authenticator_secret, token)

    if (!verified || verified.delta !== 0) {
      return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error verifying MFA:", error)
    return NextResponse.json({ success: false, error: "Failed to verify MFA" }, { status: 500 })
  }
}
