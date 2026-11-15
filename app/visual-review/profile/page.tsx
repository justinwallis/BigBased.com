import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Profile } from "@/app/actions/profile-actions"
import { PublicProfilePageClient } from "@/app/[username]/PublicProfilePageClient"

export const metadata: Metadata = {
  title: "Fictional profile layout review | BigBased",
  description: "Visual-only sample profile. No real BigBased account or personal data.",
  robots: { index: false, follow: false },
}

// An isolated visual-review fixture: no database reads, external API calls,
// real names, or profile data. Never expose this route in production.
const SAMPLE_PROFILE: Profile = {
  id: "00000000-0000-0000-0000-000000000000",
  username: "sample-creator",
  full_name: "Sample Creator",
  bio: "Fictional profile for visual layout review. No real account, messages or data.",
  avatar_url: "",
  banner_url: "",
  banner_position: "center",
  website: "",
  social_links: {},
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
}

export default function VisualReviewProfile() {
  if (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development") {
    notFound()
  }

  return <PublicProfilePageClient profile={SAMPLE_PROFILE} />
}
