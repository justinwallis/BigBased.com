"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const avatarSrc = isDark ? "/BigBasedIconInvert.png" : "/bb-logo.png" // Assuming you have a dark mode logo for AI

  return (
    <div className={cn("flex items-start gap-4 p-4", role === "user" ? "justify-end" : "justify-start")}>
      {role === "assistant" && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarSrc || "/placeholder.svg"} alt="AI Avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-lg p-3",
          role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        <p className="text-sm">{content}</p>
      </div>
      {role === "user" && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User Avatar" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
