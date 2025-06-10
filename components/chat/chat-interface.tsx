"use client"

import { useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { ChatSuggestions } from "./chat-suggestions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "next-themes"
import Image from "next/image"

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: "/api/ai/chat",
    initialMessages: [],
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const logoSrc = isDark ? "/BigBasedIconInvert.png" : "/bb-logo.png"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text: string) => {
    append({ role: "user", content: text })
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <Image
            src={logoSrc || "/placeholder.svg"}
            alt="BigBased Logo"
            width={128}
            height={128}
            className="h-32 w-32 mb-6"
          />
          <h1 className="text-3xl font-bold mb-2">
            How can <span className="text-primary">We</span> help you?
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mb-8">
            Start a conversation with a based herd of agents to traverse the Big Based information universe.
          </p>
          <div className="w-full max-w-2xl px-4">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            <ChatSuggestions onSelectSuggestion={handleSuggestionClick} />
          </div>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 p-4">
            {messages.map((m) => (
              <ChatMessage key={m.id} role={m.role as "user" | "assistant"} content={m.content} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <ChatMessage role="assistant" content="Thinking..." />
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <div className="w-full max-w-2xl mx-auto px-4 pb-4">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            <ChatSuggestions onSelectSuggestion={handleSuggestionClick} />
          </div>
        </>
      )}
    </div>
  )
}
