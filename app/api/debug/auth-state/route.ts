import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Get user from Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    // Get session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    // Check cookies
    const cookies = {
      "sb-access-token": request.cookies.get("sb-access-token")?.value || "Not found",
      "supabase-auth-token": request.cookies.get("supabase-auth-token")?.value || "Not found",
      "sb-refresh-token": request.cookies.get("sb-refresh-token")?.value || "Not found",
    }

    // Get all cookies for debugging
    const allCookies = Array.from(request.cookies.entries()).map(([name, cookie]) => ({
      name,
      value: cookie.value.substring(0, 50) + (cookie.value.length > 50 ? "..." : ""),
    }))

    // Check if profile exists
    let profileExists = false
    let profileData = null
    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      profileExists = !!profile && !profileError
      profileData = profile
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      user: user
        ? {
            id: user.id,
            email: user.email,
            email_confirmed_at: user.email_confirmed_at,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
          }
        : null,
      userError: userError?.message || null,
      session: session
        ? {
            access_token: session.access_token ? "Present" : "Missing",
            refresh_token: session.refresh_token ? "Present" : "Missing",
            expires_at: session.expires_at,
            user_id: session.user?.id,
          }
        : null,
      sessionError: sessionError?.message || null,
      cookies,
      allCookies,
      profileExists,
      profileData: profileData
        ? {
            id: profileData.id,
            username: profileData.username,
            created_at: profileData.created_at,
          }
        : null,
      middleware_check: {
        has_sb_access_token: !!request.cookies.get("sb-access-token"),
        has_supabase_auth_token: !!request.cookies.get("supabase-auth-token"),
        would_pass_middleware: !!(request.cookies.get("sb-access-token") || request.cookies.get("supabase-auth-token")),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
