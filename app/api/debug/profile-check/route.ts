import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCurrentUserProfile } from "@/app/actions/profile-actions"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({
        success: false,
        error: "Not authenticated",
        authStatus: { user: null, error: userError?.message },
      })
    }

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // Get profile using the action
    const actionProfile = await getCurrentUserProfile()

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      profileExists: !!profile,
      profileError: profileError?.message,
      profile: profile,
      actionProfile: actionProfile,
      cookies: {
        hasAccessToken: !!supabase.auth.getSession(),
      },
    })
  } catch (error) {
    console.error("Profile check error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
