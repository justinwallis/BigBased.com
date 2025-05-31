import { getUserProfileByUsername } from "@/app/actions/profile-actions"
import { PublicProfilePageClient } from "./PublicProfilePageClient"
import { notFound } from "next/navigation"

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const profile = await getUserProfileByUsername(params.username)

  if (!profile) {
    notFound()
  }

  return <PublicProfilePageClient profile={profile} />
}
