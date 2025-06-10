import type { ReactNode } from "react"
import "@/app/chat/chat-styles.css" // Import the chat-specific styles

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <div className="chat-container">{children}</div>
}
