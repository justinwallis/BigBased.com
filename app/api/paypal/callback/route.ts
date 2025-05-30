import { createClient } from "@/lib/supabase/server"
import { neon } from "@neondatabase/serverless"

// PayPal LIVE OAuth endpoints (since you're using live credentials)
const PAYPAL_TOKEN_URL = "https://api-m.paypal.com/v1/oauth2/token"
const PAYPAL_USER_INFO_URL = "https://api-m.paypal.com/v1/identity/oauth2/userinfo?schema=paypalv1.1"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    const error = url.searchParams.get("error")
    const errorDescription = url.searchParams.get("error_description")

    console.log("PayPal callback received:", { code: !!code, state: !!state, error, errorDescription })

    // Handle PayPal errors
    if (error) {
      console.error("PayPal OAuth error:", error, errorDescription)
      return Response.redirect(`${url.origin}/profile/billing?error=${encodeURIComponent(errorDescription || error)}`)
    }

    if (!code || !state) {
      return Response.redirect(`${url.origin}/profile/billing?error=Invalid OAuth response`)
    }

    // Get the authenticated user
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return Response.redirect(`${url.origin}/profile/billing?error=Authentication required`)
    }

    // Verify the state parameter using Neon
    const sql = neon(process.env.DATABASE_URL!)
    const oauthStates = await sql`
      SELECT session_data FROM oauth_states 
      WHERE user_id = ${userData.user.id} 
      AND state_value = ${state}
      AND provider = 'paypal'
      AND expires_at > NOW()
      ORDER BY created_at DESC 
      LIMIT 1
    `

    if (!oauthStates || oauthStates.length === 0) {
      console.error("Invalid OAuth state:", "State not found or expired")
      return Response.redirect(`${url.origin}/profile/billing?error=Invalid or expired authentication state`)
    }

    // Clean up the used state
    await sql`
      DELETE FROM oauth_states 
      WHERE user_id = ${userData.user.id} 
      AND state_value = ${state} 
      AND provider = 'paypal'
    `

    // Exchange the authorization code for an access token
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_SECRET_KEY
    const redirectUri = `${url.origin}/api/paypal/callback`

    if (!clientId || !clientSecret) {
      return Response.redirect(`${url.origin}/profile/billing?error=PayPal credentials not configured`)
    }

    console.log("Exchanging code for token...")

    const tokenResponse = await fetch(PAYPAL_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error("PayPal token error:", errorData)
      return Response.redirect(`${url.origin}/profile/billing?error=Failed to authenticate with PayPal`)
    }

    const tokenData = await tokenResponse.json()
    const { access_token, refresh_token, expires_in } = tokenData

    console.log("Got PayPal token, fetching user info...")

    // Get user info from PayPal
    const userInfoResponse = await fetch(PAYPAL_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      const errorData = await userInfoResponse.json()
      console.error("PayPal user info error:", errorData)
      return Response.redirect(`${url.origin}/profile/billing?error=Failed to get PayPal account information`)
    }

    const userInfo = await userInfoResponse.json()
    const paypalEmail = userInfo.emails?.[0]?.value || userInfo.email

    console.log("PayPal user info received:", { email: paypalEmail })

    if (!paypalEmail) {
      return Response.redirect(`${url.origin}/profile/billing?error=Could not retrieve PayPal email`)
    }

    // Store PayPal connection in user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("social_links")
      .eq("id", userData.user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      return Response.redirect(`${url.origin}/profile/billing?error=Failed to update profile`)
    }

    const socialLinks = profile.social_links || {}
    const updatedSocialLinks = {
      ...socialLinks,
      paypal_connected: true,
      paypal_email: paypalEmail,
      paypal_access_token: access_token,
      paypal_refresh_token: refresh_token,
      paypal_token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        social_links: updatedSocialLinks,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userData.user.id)

    if (updateError) {
      console.error("Error updating profile with PayPal info:", updateError)
      return Response.redirect(`${url.origin}/profile/billing?error=Failed to save PayPal connection`)
    }

    console.log("PayPal connection saved successfully")

    // Redirect back to the billing page with success
    return Response.redirect(
      `${url.origin}/profile/billing?paypal_connected=true&email=${encodeURIComponent(paypalEmail)}`,
    )
  } catch (error: any) {
    console.error("PayPal callback error:", error)
    return Response.redirect(
      `${new URL(request.url).origin}/profile/billing?error=${encodeURIComponent(error.message || "An unexpected error occurred")}`,
    )
  }
}
