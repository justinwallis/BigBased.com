import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = params.username

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient(true) // Use service role

    // Query the profiles table for the username
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("username", username).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return NextResponse.json({ error: "Error fetching profile" }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return sanitized profile data (remove sensitive fields)
    const safeProfile = {
      id: profile.id,
      username: profile.username,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      website: profile.website,
      bio: profile.bio,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }

    return NextResponse.json(safeProfile)
  } catch (error) {
    console.error("Unexpected error in user API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
