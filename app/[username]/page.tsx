import { PublicProfilePageClient } from "./PublicProfilePageClient"
import type { Metadata } from "next"

// Add static metadata to prevent the title error
export const metadata: Metadata = {
  title: "User Profile | Big Based",
  description: "View user profile on Big Based",
}

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  return <PublicProfilePageClient username={params.username} />
}
