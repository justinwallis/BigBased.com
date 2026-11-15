"use client"

import Link from "next/link"
import { PlusIcon, MessageSquareIcon, UserIcon, MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useChatWorkspace } from "./chat-workspace"

// These are the original 2025 visual examples, not fabricated chat history.
// Selecting one creates a real, local draft that can be revisited in this tab.
const originalTopics = [
  "BigBased Principles",
  "AI Integration Guide",
  "Community Guidelines",
  "Future of Decentralization",
  "Content Indexing Deep Dive",
  "User Management Best Practices",
  "Affiliate Program Details",
  "Shop System Overview",
  "Documentation Structure",
  "Security Features Explained",
]

type ChatSidebarProps = {
  onNavigate?: () => void
}

export function ChatSidebar({ onNavigate }: ChatSidebarProps) {
  const { threads, activeId, newChat, openChat, removeChat, beginTopic } = useChatWorkspace()

  const startNewChat = () => {
    newChat()
    onNavigate?.()
  }

  return (
    <div className="flex h-full max-h-full min-w-0 flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between px-4">
        <button type="button" onClick={startNewChat} className="flex items-center gap-2 font-semibold">
          <span className="text-lg">BigBased GPT</span>
        </button>
        <Button
          type="button"
          className="rounded-full border-none"
          size="icon"
          variant="ghost"
          onClick={startNewChat}
          aria-label="New chat"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <Separator className="my-2" />
      <ScrollArea className="min-h-0 flex-1 py-2">
        <div className="grid gap-1 px-4">
          <button
            type="button"
            onClick={startNewChat}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800"
          >
            <MessageSquareIcon className="h-4 w-4" />
            Chats
          </button>

          {threads.map((chat) => (
            <div
              key={chat.id}
              className={"flex items-center justify-between rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800 " +
                (activeId === chat.id ? "bg-gray-100 dark:bg-gray-800" : "")}
            >
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left"
                onClick={() => { openChat(chat.id); onNavigate?.() }}
                aria-current={activeId === chat.id ? "page" : undefined}
              >
                {chat.title}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 border-none" aria-label={"Options for " + chat.title}>
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { openChat(chat.id); onNavigate?.() }}>
                    Open chat
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => removeChat(chat.id)}>
                    Delete local draft
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}

          <p className="px-3 pt-4 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Original example topics
          </p>
          {originalTopics.map((topic) => (
            <button
              type="button"
              key={topic}
              onClick={() => { beginTopic(topic); onNavigate?.() }}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800"
            >
              <span className="truncate">{topic}</span>
            </button>
          ))}

          <Link
            className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800"
            href="/profile"
            onClick={onNavigate}
          >
            <UserIcon className="h-4 w-4" />
            Account
          </Link>
        </div>
      </ScrollArea>
    </div>
  )
}
