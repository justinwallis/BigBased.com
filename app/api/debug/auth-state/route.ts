import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    // Get all cookie names and values (truncated for security)
    const allCookies = cookies()
      .getAll()
      .map((cookie) => ({
        name: cookie.name,
        hasValue: !!cookie.value,
        valueLength: cookie.value.length,
        valuePreview: cookie.value.substring(0, 20) + "...",
      }))

    // Check if there's a specific auth cookie
    const authCookies = allCookies.filter(
      (cookie) => cookie.name.includes("auth") || cookie.name.includes("supabase") || cookie.name.startsWith("sb-"),
    )

    // Get user if session exists
    let user = null
    let profile = null

    if (session) {
      user = session.user

      // Try to get the user's profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!profileError) {
        profile = profileData
      }
    }

    // Try to manually get the session using the specific cookie
    let manualSessionCheck = null
    try {
      const authCookie = cookies().get("sb-zcmjnapixchrzafkbzhq-auth-token")
      if (authCookie) {
        manualSessionCheck = {
          cookieExists: true,
          cookieValue: authCookie.value.substring(0, 50) + "...",
          cookieLength: authCookie.value.length,
        }
      }
    } catch (error) {
      manualSessionCheck = { error: error.message }
    }

    return NextResponse.json({
      authenticated: !!session,
      sessionExists: !!session,
      user: user
        ? {
            id: user.id,
            email: user.email,
            emailConfirmed: user.email_confirmed_at ? true : false,
            lastSignIn: user.last_sign_in_at,
            createdAt: user.created_at,
          }
        : null,
      profile: profile,
      cookieCount: allCookies.length,
      allCookies: allCookies,
      authCookies: authCookies,
      manualSessionCheck: manualSessionCheck,
      sessionError: sessionError?.message || null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
