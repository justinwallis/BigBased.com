"use client"

import type * as React from "react"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatWorkspaceProvider } from "@/components/chat/chat-workspace"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const closeMobileSidebar = useCallback(() => setIsMobileSidebarOpen(false), [])
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ChatWorkspaceProvider>
      <div
        className={cn(
          "relative flex h-[calc(100dvh-3.5rem)] min-h-0 w-full overflow-hidden",
          isDark ? "bg-darkbg-DEFAULT text-white" : "bg-white text-black",
        )}
      >
        {isMobileSidebarOpen && (
          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close chat history"
            className="absolute inset-0 z-30 bg-black/50 md:hidden"
          />
        )}

        {/* Preserve the original 2025 sidebar and its width on desktop. */}
        <aside
          className={cn(
            "absolute inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-[#080808] md:relative md:z-auto",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            isSidebarOpen ? "md:w-64" : "md:w-0 md:overflow-hidden md:border-0",
          )}
        >
          <ChatSidebar onNavigate={closeMobileSidebar} />
        </aside>

        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (window.matchMedia("(min-width: 768px)").matches) {
                setIsSidebarOpen((open) => !open)
              } else {
                setIsMobileSidebarOpen((open) => !open)
              }
            }}
            aria-label="Toggle chat history"
            className="absolute left-4 top-4 z-20 border-none text-gray-900 dark:text-white"
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
          <div className="min-h-0 flex-1 pt-12">{children}</div>
        </main>
      </div>
    </ChatWorkspaceProvider>
  )
}
