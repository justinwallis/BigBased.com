"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Users,
  Trophy,
  BookOpen,
  Hash,
  ChevronDown,
  ChevronRight,
  Minimize2,
  Maximize2,
  X,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for chat
const chatChannels = [
  { id: "general", name: "General", color: "bg-blue-500", unread: 3 },
  { id: "help", name: "Help & Support", color: "bg-green-500", unread: 0 },
  { id: "showcase", name: "Showcase", color: "bg-purple-500", unread: 1 },
  { id: "announcements", name: "Announcements", color: "bg-red-500", unread: 0 },
]

const chatMessages = [
  {
    id: 1,
    channel: "general",
    user: "Alex",
    message: "Chat here, create a topic in Help...",
    time: "Yesterday",
    avatar: "A",
  },
  { id: 2, channel: "help", user: "Sarah", message: "Chat here, create a topic in...", time: "Thursday", avatar: "S" },
  {
    id: 3,
    channel: "showcase",
    user: "Mike",
    message: "Chat here, create a topic in V0 Help...",
    time: "6:28 PM",
    avatar: "M",
  },
  {
    id: 4,
    channel: "announcements",
    user: "Big Based",
    message: "Chat here, create a topic in Help...",
    time: "3:34 PM",
    avatar: "BB",
  },
]

interface CommunityClientLayoutProps {
  children: React.ReactNode
}

export function CommunityClientLayout({ children }: CommunityClientLayoutProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState("general")
  const [newMessage, setNewMessage] = useState("")
  const [expandedSections, setExpandedSections] = useState({
    communityArea: true,
    tags: true,
    channels: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const sidebarItems = [
    { icon: MessageCircle, label: "Categories", href: "/community", active: pathname === "/community" },
    { icon: Users, label: "My Posts", href: "/community/my-posts" },
    { icon: Trophy, label: "Leaderboard", href: "/community/leaderboard" },
    { icon: BookOpen, label: "Code of Conduct", href: "/community/code-of-conduct" },
    { icon: BookOpen, label: "Handbook", href: "/community/handbook" },
  ]

  const communityAreaItems = [
    { icon: MessageCircle, label: "Announcements", href: "/community/announcements" },
    { icon: Users, label: "Events", href: "/community/events" },
    { icon: Trophy, label: "Showcase", href: "/community/showcase" },
    { icon: Hash, label: "Discussions", href: "/community/discussions" },
    { icon: MessageCircle, label: "Help", href: "/community/help" },
  ]

  const chatItems = [
    { icon: MessageCircle, label: "Big Based Chat", href: "/community/chat/general" },
    { icon: Hash, label: "Help & Support", href: "/community/chat/help" },
    { icon: Hash, label: "Showcase Chat", href: "/community/chat/showcase" },
    { icon: Hash, label: "Feature Requests", href: "/community/chat/features" },
  ]

  const tags = [
    { name: "nextjs", count: 1234, color: "bg-blue-500" },
    { name: "react", count: 987, color: "bg-cyan-500" },
    { name: "typescript", count: 654, color: "bg-blue-600" },
    { name: "api", count: 432, color: "bg-green-500" },
    { name: "deployment", count: 321, color: "bg-purple-500" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-black border-r border-gray-800 h-screen overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Main Navigation */}
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    item.active ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Community Area */}
            <div>
              <button
                onClick={() => toggleSection("communityArea")}
                className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 hover:text-white transition-colors"
              >
                {expandedSections.communityArea ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                Community Area
              </button>
              {expandedSections.communityArea && (
                <nav className="space-y-1">
                  {communityAreaItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            {/* Chat Section */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <Hash className="h-3 w-3" />
                Chat
              </div>
              <nav className="space-y-1">
                {chatItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full text-left"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tags */}
            <div>
              <button
                onClick={() => toggleSection("tags")}
                className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 hover:text-white transition-colors"
              >
                {expandedSections.tags ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                Tags
              </button>
              {expandedSections.tags && (
                <div className="space-y-1">
                  {tags.map((tag) => (
                    <Link
                      key={tag.name}
                      href={`/community/tags/${tag.name}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <div className={cn("w-2 h-2 rounded-full", tag.color)} />
                      <span className="flex-1">{tag.name}</span>
                      <span className="text-xs text-gray-500">{tag.count}</span>
                    </Link>
                  ))}
                  <Link
                    href="/community/tags"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <Hash className="h-4 w-4" />
                    All tags
                  </Link>
                </div>
              )}
            </div>

            {/* Channels */}
            <div>
              <button
                onClick={() => toggleSection("channels")}
                className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 hover:text-white transition-colors"
              >
                {expandedSections.channels ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                Channels
              </button>
              {expandedSections.channels && (
                <div className="space-y-1">
                  {chatChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setSelectedChannel(channel.id)
                        setIsChatOpen(true)
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full text-left"
                    >
                      <div className={cn("w-2 h-2 rounded-full", channel.color)} />
                      <span className="flex-1">{channel.name}</span>
                      {channel.unread > 0 && (
                        <Badge variant="destructive" className="h-4 w-4 p-0 text-xs flex items-center justify-center">
                          {channel.unread}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">{children}</div>
      </div>

      {/* Chat Popup */}
      {isChatOpen && (
        <div
          className={cn(
            "fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl transition-all duration-300",
            isChatMinimized ? "w-80 h-12" : "w-96 h-96",
          )}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-400" />
              <span className="font-medium text-sm">Chat</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsChatMinimized(!isChatMinimized)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                {isChatMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </button>
              <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-gray-700 rounded transition-colors">
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>

          {!isChatMinimized && (
            <>
              {/* Channels List */}
              <div className="p-3 border-b border-gray-700">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Channels</h3>
                <div className="space-y-1">
                  {chatChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.id)}
                      className={cn(
                        "flex items-center gap-2 w-full p-2 rounded text-sm transition-colors",
                        selectedChannel === channel.id
                          ? "bg-gray-700 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-800",
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full", channel.color)} />
                      <span className="flex-1 text-left">{channel.name}</span>
                      {channel.unread > 0 && (
                        <Badge variant="destructive" className="h-4 w-4 p-0 text-xs">
                          {channel.unread}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-3 space-y-2 max-h-48 overflow-y-auto">
                {chatMessages
                  .filter((msg) => msg.channel === selectedChannel)
                  .map((message) => (
                    <div key={message.id} className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                        {message.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{message.user}</span>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-300 truncate">{message.message}</p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        // Handle send message
                        setNewMessage("")
                      }
                    }}
                  />
                  <Button size="sm" className="px-3">
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
