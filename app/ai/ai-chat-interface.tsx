"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, Send, Plus, User, Bot, ChevronLeft, TrendingUp, BookOpen, Users, Shield, Trash2 } from "lucide-react"
import { useChat } from "ai/react"
import BBLogo from "@/components/bb-logo"
import { cn } from "@/lib/utils"
import Link from "next/link" // Import Link for navigation

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export default function AIChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/ai/chat",
    body: {
      domain: "bigbased.com",
    },
    onFinish: (message) => {
      // Save conversation to chat history
      saveMessageToHistory(message)
    },
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  // Load chat sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("bigbased-chat-sessions")
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions)
        setChatSessions(sessions)
        // If there are saved sessions, load the most recent one by default
        if (sessions.length > 0 && !currentSessionId) {
          loadChatSession(sessions[0].id)
        }
      } catch (error) {
        console.error("Error loading chat sessions:", error)
      }
    } else {
      // If no sessions, start a new one automatically
      startNewChat()
    }
  }, [])

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bigbased-chat-sessions", JSON.stringify(chatSessions))
  }, [chatSessions])

  // Save message to current session
  const saveMessageToHistory = (message: any) => {
    if (!currentSessionId) return

    const updatedSessions = chatSessions.map((session) => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          messages: [
            ...session.messages,
            {
              id: message.id,
              role: message.role,
              content: message.content,
              timestamp: new Date(),
            },
          ],
          updatedAt: new Date(),
        }
      }
      return session
    })

    setChatSessions(updatedSessions) // Use setChatSessions to trigger useEffect for localStorage
  }

  // Start new chat session
  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat", // Default title, could be updated later
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedSessions = [newSession, ...chatSessions]
    setChatSessions(updatedSessions) // Update state
    setCurrentSessionId(newSession.id)
    setMessages([]) // Clear messages for the new chat
  }

  // Load existing chat session
  const loadChatSession = (sessionId: string) => {
    const session = chatSessions.find((s) => s.id === sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(
        session.messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        })),
      )
    }
  }

  // Delete chat session
  const deleteChatSession = (sessionId: string) => {
    const updatedSessions = chatSessions.filter((session) => session.id !== sessionId)
    setChatSessions(updatedSessions)

    if (currentSessionId === sessionId) {
      // If the deleted session was the current one, start a new chat
      if (updatedSessions.length > 0) {
        loadChatSession(updatedSessions[0].id)
      } else {
        startNewChat()
      }
    }
  }

  // Handle quick action buttons
  const handleQuickAction = (action: string) => {
    const prompts = {
      trending: "What are the current trending topics in conservative politics and digital sovereignty?",
      knowledge: "Tell me about BigBased's mission and conservative values.",
      community: "How can I get involved in the BigBased community?",
      security: "What are the best practices for digital privacy and security?",
    }

    const prompt = prompts[action as keyof typeof prompts]
    if (prompt) {
      handleInputChange({ target: { value: prompt } } as any)
      // Auto-submit after a brief delay
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.form?.requestSubmit()
        }
      }, 100)
    }
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="flex h-screen bg-[#080808] text-white">
      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col border-r border-gray-800 transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-80" : "w-0 overflow-hidden",
          "lg:relative absolute z-50 h-full bg-[#080808]",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link href="/ai" className="flex items-center space-x-2 group">
            <BBLogo size="sm" />
            <span className="font-semibold text-lg group-hover:text-purple-400 transition-colors">BigBased AI</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={startNewChat}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-hidden">
          <div className="px-4 py-2">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Chats</h3>
          </div>
          <ScrollArea className="flex-1 px-2">
            {chatSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between group">
                <Button
                  variant="ghost"
                  className={cn(
                    "flex-1 justify-start mb-1 text-left h-auto p-3 pr-10", // Added pr-10 for delete button space
                    currentSessionId === session.id
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50",
                  )}
                  onClick={() => loadChatSession(session.id)}
                >
                  <div className="truncate">
                    <div className="font-medium truncate">{session.title}</div>
                    <div className="text-xs text-gray-500">{formatTime(new Date(session.updatedAt))}</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteChatSession(session.id)}
                  aria-label={`Delete chat session ${session.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Account Section */}
        <div className="border-t border-gray-800 p-4">
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
            <User className="h-4 w-4 mr-2" />
            Account
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            {/* New Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="lg:hidden">
              <BBLogo size="sm" />
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-8">
                <BBLogo size="lg" />
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                How can <span className="text-purple-400">We</span> help you?
              </h1>

              <p className="text-gray-400 text-lg mb-12 max-w-2xl">
                Start a conversation with BigBased AI to explore conservative values, digital sovereignty, and community
                building.
              </p>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white"
                  onClick={() => handleQuickAction("trending")}
                >
                  <TrendingUp className="h-6 w-6" />
                  <span>Trending Topics</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white"
                  onClick={() => handleQuickAction("security")}
                >
                  <Shield className="h-6 w-6" />
                  <span>Digital Security</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white"
                  onClick={() => handleQuickAction("knowledge")}
                >
                  <BookOpen className="h-6 w-6" />
                  <span>Knowledge Base</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white"
                  onClick={() => handleQuickAction("community")}
                >
                  <Users className="h-6 w-6" />
                  <span>Community</span>
                </Button>
              </div>
            </div>
          ) : (
            // Chat Messages
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex gap-4", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-3",
                        message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-100",
                      )}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-lg px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-800 p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type anything to BigBased..."
                  disabled={isLoading}
                  className="w-full bg-gray-900 border-gray-700 text-white placeholder-gray-400 pr-12 py-6 text-lg focus:border-purple-500 focus:ring-purple-500"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
