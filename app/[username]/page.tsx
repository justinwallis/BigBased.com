import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { PublicProfilePageClient } from "./PublicProfilePageClient"

type ProfilePageProps = {
  params: Promise<{ username: string }>
}

// Only fields intended for public-facing presentation are ever selected.
// The historical table also stores private/contact data in social_links._extended.
// Never pass a whole database record to a client component.
const PROFILE_PRESENTATION_COLUMNS =
  "id,username,full_name,bio,avatar_url,banner_url,website,created_at,updated_at"

const RESERVED_USERNAMES = new Set(["admin", "api", "auth"])

async function getVisibleProfile(username: string) {
  if (!username || RESERVED_USERNAMES.has(username)) return null

  // Respect the caller's session and the database RLS policy.
  // Do not use a service-role client for an untrusted username lookup.
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_PRESENTATION_COLUMNS)
    .eq("username", username)
    .maybeSingle()

  if (error) {
    console.error("Profile lookup failed:", { code: error.code })
    return null
  }

  return data
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const profile = await getVisibleProfile(username)

  if (!profile) {
    return {
      title: "Profile Unavailable | BigBased",
      description: "This profile is not available for public viewing.",
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `${profile.full_name || profile.username} | BigBased`,
    description: profile.bio || "BigBased creator profile",
    // The historical profiles are not publicly published until a
    // separate opt-in public-profile contract is implemented and reviewed.
    robots: { index: false, follow: false },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const profile = await getVisibleProfile(username)
  if (!profile) notFound()

  // Explicit projection: no contact details, birthdays, personal details,
  // social_links._extended, roles, emails or private database columns.
  // Keep the original profile JSX/CSS unchanged for visual review.
  return (
    <PublicProfilePageClient
      profile={{
        id: profile.id,
        username: profile.username,
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
        banner_url: profile.banner_url || "",
        banner_position: "center",
        website: profile.website || "",
        created_at: profile.created_at || "",
        updated_at: profile.updated_at || "",
        social_links: {},
      }}
    />
  )
}
