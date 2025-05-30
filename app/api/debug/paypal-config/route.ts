import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)

    // Get environment info
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_SECRET_KEY
    const nodeEnv = process.env.NODE_ENV

    // Build what would be the redirect URI
    const redirectUri = `${url.origin}/api/paypal/callback`

    // Build what would be the auth URL
    const PAYPAL_BASE_URL = nodeEnv === "production" ? "https://www.paypal.com" : "https://www.sandbox.paypal.com"
    const PAYPAL_AUTH_URL = `${PAYPAL_BASE_URL}/connect`

    const debugInfo = {
      environment: nodeEnv,
      paypalBaseUrl: PAYPAL_BASE_URL,
      authUrl: PAYPAL_AUTH_URL,
      clientId: clientId ? `${clientId.substring(0, 10)}...` : "NOT SET",
      clientSecret: clientSecret ? "SET" : "NOT SET",
      redirectUri,
      origin: url.origin,
      fullAuthUrl: (() => {
        if (!clientId) return "CLIENT_ID_MISSING"

        const authUrl = new URL(PAYPAL_AUTH_URL)
        authUrl.searchParams.append("flowEntry", "static")
        authUrl.searchParams.append("client_id", clientId)
        authUrl.searchParams.append("response_type", "code")
        authUrl.searchParams.append("scope", "openid email https://uri.paypal.com/services/payments/payment")
        authUrl.searchParams.append("redirect_uri", redirectUri)
        authUrl.searchParams.append("state", "DEBUG_STATE_123")

        return authUrl.toString()
      })(),
    }

    return NextResponse.json(debugInfo, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
