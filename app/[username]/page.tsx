import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

interface ProfilePageProps {
  params: {
    username: string
  }
}

// Static metadata to avoid build-time issues
export const metadata: Metadata = {
  title: "Profile | Big Based",
  description: "View user profile on Big Based",
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

    // Simple profile display to avoid complex component issues
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#080808] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {profile?.full_name || profile?.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">@{profile?.username}</p>
            {profile?.bio && <p className="text-gray-700 dark:text-gray-300 mb-6">{profile.bio}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Profile Information</h2>
                <div className="space-y-2">
                  {profile?.personal_info?.nickname && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nickname: {profile.personal_info.nickname}
                    </p>
                  )}
                  {profile?.location_info?.current_city && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Location: {profile.location_info.current_city}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Member since: {new Date(profile?.created_at || Date.now()).getFullYear()}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Activity</h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Posts: 0</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Followers: 0</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Following: 0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading profile:", error)
    notFound()
  }
}
