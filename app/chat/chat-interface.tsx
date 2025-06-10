"use client"

import { useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { useAuth } from "@/contexts/auth-context" // Assuming this path is correct
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bot } from "lucide-react" // Using Lucide React for icons

export default function ChatInterface() {
  const { user, isLoading } = useAuth()
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isAiLoading,
    error,
  } = useChat({
    api: "/api/chat/chat", // Corrected API route
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    console.log("ChatInterface - User:", user)
    console.log("ChatInterface - isLoading (Auth):", isLoading)
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading user data...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>User Not Found. Please log in to use the chat.</p>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto my-4 flex flex-col h-[calc(100vh-2rem)]">
      <CardHeader className="chat-header">
        <CardTitle>BigBased AI Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-0">
        <ScrollArea className="chat-messages flex-grow">
          {messages.map((m) => (
            <div key={m.id} className={`message-bubble ${m.role === "user" ? "user-message" : "ai-message"}`}>
              <div className="flex items-start gap-2">
                <Avatar className="w-8 h-8">
                  {m.role === "user" ? (
                    <>
                      <AvatarImage
                        src={user.user_metadata?.avatar_url || "/placeholder.svg?height=32&width=32"}
                        alt={user.email || "User"}
                      />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback>
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <p className="text-sm">{m.content}</p>
              </div>
            </div>
          ))}
          {isAiLoading && messages.length > 0 && (
            <div className="message-bubble ai-message">
              <div className="flex items-start gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <form onSubmit={handleSubmit} className="chat-input-area">
          <Input
            className="chat-input"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            disabled={isAiLoading}
          />
          <Button type="submit" className="send-button" disabled={isAiLoading || !input.trim()}>
            {isAiLoading ? "Sending..." : "Send"}
          </Button>
        </form>
        {error && <div className="p-2 text-red-500 text-center text-sm">Error: {error.message}</div>}
      </CardContent>
    </Card>
  )
}
