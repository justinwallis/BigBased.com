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

    // Get all cookie names
    const allCookies = cookies()
      .getAll()
      .map((cookie) => cookie.name)

    // Check if there's a specific auth cookie
    const authCookieNames = allCookies.filter(
      (name) => name.includes("auth") || name.includes("supabase") || name.startsWith("sb-"),
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
      authCookies: authCookieNames,
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
