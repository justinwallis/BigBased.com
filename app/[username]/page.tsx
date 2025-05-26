import { PublicProfilePageClient } from "./PublicProfilePageClient"
import { getUserProfileByUsername } from "@/app/actions/profile-actions"
import type { Metadata } from "next"

interface PublicProfilePageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const profile = await getUserProfileByUsername(params.username)

  if (!profile) {
    return {
      title: "Profile Not Found - Big Based",
      description: "The requested profile could not be found.",
    }
  }

  return {
    title: `${profile.full_name || profile.username} - Big Based`,
    description: profile.bio || `View ${profile.full_name || profile.username}'s profile on Big Based.`,
    openGraph: {
      title: `${profile.full_name || profile.username} - Big Based`,
      description: profile.bio || `View ${profile.full_name || profile.username}'s profile on Big Based.`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  }
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const profile = await getUserProfileByUsername(params.username)

  return <PublicProfilePageClient profile={profile} />
}
