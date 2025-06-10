"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Menu,
  Send,
  Plus,
  User,
  Bot,
  ChevronLeft,
  Trash2,
  TrendingUp,
  BookOpen,
  Users,
  Shield,
  Sun,
  Moon,
} from "lucide-react"
import { useChat } from "ai/react"
import BBLogo from "@/components/bb-logo"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTheme } from "next-themes" // Import useTheme

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

export default function ChatPage() {
  const { theme, setTheme } = useTheme() // Use theme hook
  const [sidebarOpen, setSidebarOpen] = useState(false) // Default to closed
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

  // Load chat sessions and sidebar state from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("bigbased-chat-sessions")
    let sessions: ChatSession[] = []
    if (savedSessions) {
      try {
        sessions = JSON.parse(savedSessions).map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
        }))
        setChatSessions(sessions)
      } catch (error) {
        console.error("Error parsing chat sessions from localStorage:", error)
      }
    }

    // Load sidebar state
    const savedSidebarState = localStorage.getItem("bigbased-sidebar-open")
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState))
    }

    // If there are saved sessions, load the most recent one
    if (sessions.length > 0) {
      loadChatSession(sessions[0].id, sessions)
    } else {
      // If no sessions, start a new one
      startNewChat()
    }
  }, [])

  // Save chat sessions and sidebar state to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bigbased-chat-sessions", JSON.stringify(chatSessions))
  }, [chatSessions])

  useEffect(() => {
    localStorage.setItem("bigbased-sidebar-open", JSON.stringify(sidebarOpen))
  }, [sidebarOpen])

  // Save message to current session
  const saveMessageToHistory = useCallback(
    (message: any) => {
      if (!currentSessionId) return

      const updatedSessions = chatSessions.map((session) => {
        if (session.id === currentSessionId) {
          const updatedMessages = [
            ...session.messages,
            {
              id: message.id,
              role: message.role,
              content: message.content,
              timestamp: new Date(),
            },
          ]
          // If it's the first message in a new chat, set its title
          const title =
            session.title === "New Chat" && updatedMessages.length > 0
              ? updatedMessages[0].content.substring(0, 30) + (updatedMessages[0].content.length > 30 ? "..." : "")
              : session.title

          return {
            ...session,
            title: title,
            messages: updatedMessages,
            updatedAt: new Date(),
          }
        }
        return session
      })

      setChatSessions(updatedSessions)
    },
    [currentSessionId, chatSessions],
  )

  // Start new chat session
  const startNewChat = () => {
    const newSessionId = Date.now().toString()
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedSessions = [newSession, ...chatSessions]
    setChatSessions(updatedSessions)
    setCurrentSessionId(newSession.id)
    setMessages([]) // Clear messages for the new chat
  }

  // Load existing chat session
  const loadChatSession = useCallback(
    (sessionId: string, sessionsToSearch: ChatSession[] = chatSessions) => {
      const session = sessionsToSearch.find((s) => s.id === sessionId)
      if (session) {
        setCurrentSessionId(sessionId)
        setMessages(
          session.messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
          })),
        )
      } else {
        // If session not found (e.g., deleted from another tab or invalid ID), start new chat
        startNewChat()
      }
    },
    [chatSessions, setMessages],
  )

  // Delete chat session
  const deleteChatSession = (sessionId: string) => {
    const updatedSessions = chatSessions.filter((session) => session.id !== sessionId)
    setChatSessions(updatedSessions)

    if (currentSessionId === sessionId) {
      // If the deleted session was the current one, start a new chat or load the first available
      if (updatedSessions.length > 0) {
        loadChatSession(updatedSessions[0].id, updatedSessions)
      } else {
        startNewChat()
      }
    }
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Handle form submission for the chat interface
  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // If it's a new chat and the first message, save the user's message to history immediately
    if (currentSessionId && messages.length === 0 && input.trim()) {
      saveMessageToHistory({
        id: "user-" + Date.now(),
        role: "user",
        content: input,
        timestamp: new Date(),
      })
    }
    handleSubmit(e) // Call the original handleSubmit from useChat
  }

  const showWelcomeScreen = messages.length === 0 && !isLoading

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-80" : "w-0 overflow-hidden",
          "lg:relative absolute z-50 h-full bg-card", // Use bg-card for sidebar
        )}
        style={{ borderRight: "none" }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "none" }}>
          <Link href="/chat" className="flex items-center space-x-2 group" onClick={startNewChat}>
            <BBLogo size="sm" />
            <span className="font-semibold text-lg group-hover:text-primary transition-colors">BigBased AI</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={startNewChat}
            className="w-full bg-muted hover:bg-muted/80 text-foreground"
            style={{ border: "none" }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-hidden">
          <div className="px-4 py-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Chats</h3>
          </div>
          <ScrollArea className="flex-1 px-2">
            {chatSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between group">
                <Button
                  variant="ghost"
                  className={cn(
                    "flex-1 justify-start mb-1 text-left h-auto p-3 pr-10",
                    currentSessionId === session.id
                      ? "bg-accent text-accent-foreground" // Active chat color
                      : "text-muted-foreground hover:text-primary hover:bg-muted",
                  )}
                  onClick={() => loadChatSession(session.id)}
                  style={{ border: "none" }}
                >
                  <div className="truncate">
                    <div className="font-medium truncate">{session.title}</div>
                    <div className="text-xs text-muted-foreground">{formatTime(new Date(session.updatedAt))}</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteChatSession(session.id)}
                  aria-label={`Delete chat session ${session.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Account Section and Theme Toggle */}
        <div className="p-4 space-y-2" style={{ borderTop: "none" }}>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-primary"
            style={{ border: "none" }}
          >
            <User className="h-4 w-4 mr-2" />
            Account
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-primary"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ border: "none" }}
          >
            {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
            Toggle Theme
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card" style={{ borderBottom: "none" }}>
          <div className="flex items-center space-x-3">
            {/* Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-primary"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              style={{ border: "none" }}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="lg:hidden">
              <BBLogo size="sm" />
            </div>
          </div>
        </div>

        {/* Conditional Rendering: Welcome Screen vs. Chat Interface */}
        {showWelcomeScreen ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-8">
              <BBLogo size="lg" />
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              How can <span className="text-purple-400">We</span> help you?
            </h1>

            <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
              Start a conversation with BigBased AI to explore conservative values, digital sovereignty, and community
              building.
            </p>

            {/* Centered Input Area for Welcome Screen */}
            <form onSubmit={handleChatSubmit} className="w-full max-w-2xl mb-12">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type anything to BigBased..."
                  disabled={isLoading}
                  className="w-full bg-input text-foreground placeholder-muted-foreground pr-12 py-6 text-lg focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:outline-none"
                  style={{ border: "none" }}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 disabled:bg-muted"
                  style={{ border: "none" }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-card hover:bg-muted text-foreground hover:text-primary"
                onClick={() => {
                  const prompt =
                    "What are the current trending topics in conservative politics and digital sovereignty?"
                  handleInputChange({ target: { value: prompt } } as any)
                  setTimeout(() => {
                    if (inputRef.current) {
                      inputRef.current.form?.requestSubmit()
                    }
                  }, 100)
                }}
                style={{ border: "none" }}
              >
                <TrendingUp className="h-6 w-6" />
                <span>Trending Topics</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-card hover:bg-muted text-foreground hover:text-primary"
                onClick={() => {
                  const prompt = "What are the best practices for digital privacy and security?"
                  handleInputChange({ target: { value: prompt } } as any)
                  setTimeout(() => {
                    if (inputRef.current) {
                      inputRef.current.form?.requestSubmit()
                    }
                  }, 100)
                }}
                style={{ border: "none" }}
              >
                <Shield className="h-6 w-6" />
                <span>Digital Security</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-card hover:bg-muted text-foreground hover:text-primary"
                onClick={() => {
                  const prompt = "Tell me about BigBased's mission and conservative values."
                  handleInputChange({ target: { value: prompt } } as any)
                  setTimeout(() => {
                    if (inputRef.current) {
                      inputRef.current.form?.requestSubmit()
                    }
                  }, 100)
                }}
                style={{ border: "none" }}
              >
                <BookOpen className="h-6 w-6" />
                <span>Knowledge Base</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-card hover:bg-muted text-foreground hover:text-primary"
                onClick={() => {
                  const prompt = "How can I get involved in the BigBased community?"
                  handleInputChange({ target: { value: prompt } } as any)
                  setTimeout(() => {
                    if (inputRef.current) {
                      inputRef.current.form?.requestSubmit()
                    }
                  }, 100)
                }}
                style={{ border: "none" }}
              >
                <Users className="h-6 w-6" />
                <span>Community</span>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="flex-1 flex flex-col">
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
                          message.role === "user" ? "bg-purple-600 text-white" : "bg-accent text-accent-foreground", // Use accent for assistant
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
                      <div className="bg-accent rounded-lg px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Input Area at bottom for chat sessions */}
            <div className="p-4 bg-card" style={{ borderTop: "none" }}>
              <form onSubmit={handleChatSubmit} className="max-w-4xl mx-auto">
                <div className="relative">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type anything to BigBased..."
                    disabled={isLoading}
                    className="w-full bg-input text-foreground placeholder-muted-foreground pr-12 py-6 text-lg focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:outline-none"
                    style={{ border: "none" }}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 disabled:bg-muted"
                    style={{ border: "none" }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
