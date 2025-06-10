import type React from "react"
import type { Metadata } from "next"
import "./ai-styles.css"

export const metadata: Metadata = {
  title: "BigBased AI Assistant",
  description: "Chat with BigBased AI - Your conservative values and digital sovereignty assistant",
}

export default function AILayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="ai-chat-container">{children}</div>
}
