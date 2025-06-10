"use client"

import Link from "next/link"
import { PlusIcon, MessageSquareIcon, UserIcon, MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
// import Image from "next/image" // Removed as per request

export function ChatSidebar() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Placeholder for chat history
  const chatHistory = [
    { id: "1", title: "BigBased Principles" },
    { id: "2", title: "AI Integration Guide" },
    { id: "3", title: "Community Guidelines" },
    { id: "4", title: "Future of Decentralization" },
    { id: "5", title: "Content Indexing Deep Dive" },
    { id: "6", title: "User Management Best Practices" },
    { id: "7", title: "Affiliate Program Details" },
    { id: "8", title: "Shop System Overview" },
    { id: "9", title: "Documentation Structure" },
    { id: "10", title: "Security Features Explained" },
  ]

  return (
    <div className="flex h-full max-h-screen flex-col">
      <div className="flex h-16 items-center justify-between px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/chat">
          {/* Removed Image component */}
          <span className="text-lg">BigBased GPT</span>
        </Link>
        <Button className="rounded-full border-none" size="icon" variant="ghost">
          <PlusIcon className="h-4 w-4" />
          <span className="sr-only">New chat</span>
        </Button>
      </div>
      <Separator className="my-2" />
      <ScrollArea className="flex-1 py-2">
        <div className="grid gap-1 px-4">
          <Link
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800"
            href="/chat"
          >
            <MessageSquareIcon className="h-4 w-4" />
            Chats
          </Link>
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800"
            >
              <Link href={`/chat/${chat.id}`} className="flex-1 truncate">
                {chat.title}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 border-none">
                    <MoreHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Chat options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/chat/${chat.id}`}>Go to Chat</Link>
                  </DropdownMenuItem>
                  {/* Add more options here like Rename, Delete etc. */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
          <Link
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800"
            href="/profile"
          >
            <UserIcon className="h-4 w-4" />
            Account
          </Link>
        </div>
      </ScrollArea>
    </div>
  )
}
