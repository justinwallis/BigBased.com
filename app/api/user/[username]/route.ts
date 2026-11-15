import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

type RouteContext = {
  params: Promise<{ username: string }>
}

const PROFILE_API_COLUMNS = "username,full_name,bio,avatar_url,website"

const NO_STORE = { "Cache-Control": "private, no-store, max-age=0" }

export async function GET(_request: Request, { params }: RouteContext) {
  const { username } = await params
  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400, headers: NO_STORE })
  }

  try {
    // Session-aware RLS read: never bypass row permissions for a public URL.
    const supabase = createServerSupabaseClient()
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(PROFILE_API_COLUMNS)
      .eq("username", username)
      .maybeSingle()

    if (error) {
      console.error("Profile API lookup failed:", { code: error.code })
      return NextResponse.json({ error: "Profile unavailable" }, { status: 500, headers: NO_STORE })
    }

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404, headers: NO_STORE })
    }

    // No email, id, role, contact fields, or social_links._extended.
    return NextResponse.json(profile, { headers: NO_STORE })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: NO_STORE })
  }
}
