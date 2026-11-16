import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ChatLayout from "@/app/chat/layout"
import { ChatInterface } from "@/components/chat/chat-interface"

export const metadata: Metadata = {
  title: "Original BigBased Chat | Visual Review",
  description: "Historical BigBased chat interface restored for visual inspection with local-only drafts.",
  robots: { index: false, follow: false },
}

// Preview-only version of the genuine historical /chat layout. No original
// backend, unreviewed AI provider, authentication, or personal records are used
// by the restored chat components.
export default function VisualReviewChatPage() {
  if (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development") {
    notFound()
  }

  return (
    <ChatLayout>
      <ChatInterface />
    </ChatLayout>
  )
}
