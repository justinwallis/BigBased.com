import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { username } = params

    if (!username) {
      return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient(true)
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("username", username).single()

    if (error) {
      console.error("Error fetching profile by username:", error)
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 })
    }

    // Extract extended data from social_links if it exists
    if (profile && profile.social_links && profile.social_links._extended) {
      const extended = profile.social_links._extended
      profile.personal_info = extended.personal_info || {}
      profile.location_info = extended.location_info || {}
      profile.contact_info = extended.contact_info || {}
      profile.personal_details = extended.personal_details || {}

      // Remove _extended from social_links for clean data
      const { _extended, ...cleanSocialLinks } = profile.social_links
      profile.social_links = cleanSocialLinks
    } else {
      // Set default empty objects if no extended data exists
      profile.personal_info = {}
      profile.location_info = {}
      profile.contact_info = {}
      profile.personal_details = {}
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("Error in user API route:", error)
    return NextResponse.json({ success: false, error: "An error occurred while fetching the profile" }, { status: 500 })
  }
}
