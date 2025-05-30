import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: Request) {
  try {
    // Get the authenticated user
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    // Generate a random state value for CSRF protection
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Store the state in Neon database using the new oauth_states table
    const sql = neon(process.env.DATABASE_URL!)
    await sql`
      INSERT INTO oauth_states (user_id, state_value, provider, session_data, expires_at)
      VALUES (
        ${userData.user.id}, 
        ${state}, 
        'paypal', 
        ${JSON.stringify({ paypal_oauth_state: state })}, 
        ${new Date(Date.now() + 1000 * 60 * 10).toISOString()}
      )
    `

    // Get the redirect URL from the request
    const url = new URL(request.url)
    const redirectUri = `${url.origin}/api/paypal/callback`

    // Build the PayPal OAuth URL
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!clientId) {
      return NextResponse.json({ success: false, error: "PayPal client ID not configured" }, { status: 500 })
    }

    // Try a simpler OAuth approach first
    const authUrl = new URL("https://www.paypal.com/signin/authorize")
    authUrl.searchParams.append("client_id", clientId)
    authUrl.searchParams.append("response_type", "code")
    authUrl.searchParams.append("scope", "openid email")
    authUrl.searchParams.append("redirect_uri", redirectUri)
    authUrl.searchParams.append("state", state)

    // Log debug info
    console.log("PayPal OAuth Debug:", {
      clientId: clientId.substring(0, 10) + "...",
      redirectUri,
      authUrl: authUrl.toString(),
      state,
    })

    // Return the authorization URL
    return NextResponse.json({
      success: true,
      authUrl: authUrl.toString(),
      debug: {
        clientId: clientId.substring(0, 10) + "...",
        redirectUri,
        state,
      },
    })
  } catch (error: any) {
    console.error("PayPal connect error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
