import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { PublicProfilePageClient } from "./PublicProfilePageClient"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = params

  try {
    const supabase = createServerSupabaseClient(true)
    const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).single()

    if (!profile) {
      return {
        title: "User Not Found | Big Based",
        description: "This user profile could not be found.",
      }
    }

    return {
      title: `${profile.full_name || profile.username} | Big Based`,
      description: profile.bio || `${profile.username}'s profile on Big Based`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Profile | Big Based",
      description: "View user profile on Big Based",
    }
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params

  try {
    const supabase = createServerSupabaseClient(true)
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("username", username).single()

    if (error || !profile) {
      console.error("Profile not found:", username, error)
      notFound()
    }

    return <PublicProfilePageClient profile={profile} />
  } catch (error) {
    console.error("Error loading profile:", error)
    notFound()
  }
}
