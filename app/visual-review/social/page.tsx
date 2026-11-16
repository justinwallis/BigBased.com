import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SocialFeedPreviewClient } from "@/components/social-preview/SocialFeedPreviewClient"
import { getFictionalReviewFeed } from "@/lib/social-v1/preview.mjs"

export const metadata: Metadata = {
  title: "BigBased social feed — fictional design review",
  description: "Preview-only fictional creator network. No real users, social activity, data or publishing.",
  robots: { index: false, follow: false },
}

// Never expose this experimental community UI in the production deployment.
// It renders fictional seed content and local browser-session interactions only.
export default function SocialFeedVisualReviewPage() {
  if (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development") {
    notFound()
  }

  return <SocialFeedPreviewClient seedPosts={getFictionalReviewFeed()} />
}
