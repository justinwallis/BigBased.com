import type { Metadata } from "next"
import AIChatInterface from "./ai-chat-interface"

export const metadata: Metadata = {
  title: "BigBased AI Assistant",
  description: "Chat with BigBased AI - Your conservative values and digital sovereignty assistant",
}

export default function AIPage() {
  return <AIChatInterface />
}
