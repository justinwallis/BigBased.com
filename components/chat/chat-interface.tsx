"use client"

import { useRef, useEffect } from "react"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { ChatSuggestions } from "./chat-suggestions"
import { useChatWorkspace } from "./chat-workspace"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "next-themes"
import Image from "next/image"

export function ChatInterface() {
  const { messages, sendMessage } = useChatWorkspace()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const logoSrc = isDark ? "/BigBasedIconInvert.png" : "/bb-logo.png"
  const isLoading = false // Original visuals restored; live AI is intentionally not connected.

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (text: string) => {
    sendMessage(text)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const previewNotice = (
    <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
      Visual restoration · local drafts in this tab · AI replies not connected
    </p>
  )

  return (
    <div className="flex h-full min-h-0 flex-col">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center overflow-auto p-4 text-center">
          <Image
            src={logoSrc || "/placeholder.svg"}
            alt="BigBased Logo"
            width={128}
            height={128}
            className="mb-6 h-32 w-32 object-contain"
          />
          <h1 className="mb-2 text-3xl font-bold">
            How can <span className="text-primary">We</span> help you?
          </h1>
          <p className="mb-8 max-w-md text-lg text-gray-500 dark:text-gray-400">
            Start a conversation with a based herd of agents to traverse the Big Based information universe.
          </p>
          <div className="w-full max-w-2xl px-4">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            <ChatSuggestions onSelectSuggestion={handleSuggestionClick} />
            {previewNotice}
          </div>
        </div>
      ) : (
        <>
          <ScrollArea className="min-h-0 flex-1 p-4">
            {messages.map((m) => (
              <ChatMessage key={m.id} role={m.role} content={m.content} />
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <div className="mx-auto w-full max-w-2xl px-4 pb-4">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            <ChatSuggestions onSelectSuggestion={handleSuggestionClick} />
            {previewNotice}
          </div>
        </>
      )}
    </div>
  )
}
