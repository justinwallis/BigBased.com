import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { PublicProfilePageClient } from "./PublicProfilePageClient"
import { generateSafeMetadata } from "@/lib/safe-metadata"

interface ProfilePageProps {
  params: {
    username: string
  }
}

// Use safe static metadata to prevent build errors
export const metadata = generateSafeMetadata("User Profile", "View user profile on Big Based")

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params

  try {
    const supabase = createServerSupabaseClient(true)
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("username", username).single()

    if (error || !profile) {
      console.error("Profile not found:", username, error)
      notFound()
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

    return <PublicProfilePageClient profile={profile} />
  } catch (error) {
    console.error("Error loading profile:", error)
    notFound()
  }
}
