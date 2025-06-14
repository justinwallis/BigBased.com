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

    // Store the state in Neon database
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

    const url = new URL(request.url)
    const redirectUri = `${url.origin}/api/paypal/callback`
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

    if (!clientId) {
      return NextResponse.json({ success: false, error: "PayPal client ID not configured" }, { status: 500 })
    }

    // Use LIVE PayPal OAuth endpoint (since you're using live credentials)
    const authUrl = new URL("https://www.paypal.com/signin/authorize")
    authUrl.searchParams.append("client_id", clientId)
    authUrl.searchParams.append("response_type", "code")
    authUrl.searchParams.append("scope", "openid email")
    authUrl.searchParams.append("redirect_uri", redirectUri)
    authUrl.searchParams.append("state", state)

    console.log("PayPal Live OAuth URL:", authUrl.toString())

    return NextResponse.json({
      success: true,
      authUrl: authUrl.toString(),
    })
  } catch (error: any) {
    console.error("PayPal connect error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
