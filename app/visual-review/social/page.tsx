import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SocialFeedPreviewClient } from "@/components/social-preview/SocialFeedPreviewClient"
import { getFictionalReviewFeed } from "@/lib/social-v1/preview.mjs"
import { isReviewEnvironment } from "@/lib/social-v1/core.mjs"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "BigBased social feed — fictional design review",
  description: "Preview-only fictional creator network. No real users, social activity, data or publishing.",
  robots: { index: false, follow: false },
}

// Never expose this experimental community UI in the production deployment.
// It renders fictional seed content and local browser-session interactions only.
export default function SocialFeedVisualReviewPage() {
  if (!isReviewEnvironment()) {
    notFound()
  }

  return <SocialFeedPreviewClient seedPosts={getFictionalReviewFeed()} />
}
