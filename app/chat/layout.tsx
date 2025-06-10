"use client"

import type * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Start open on desktop
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className={`flex h-screen w-full ${isDark ? "bg-darkbg-DEFAULT text-white" : "bg-white text-black"}`}>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex h-full flex-col transition-all duration-300 ease-in-out shrink-0", // Added shrink-0
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden",
        )}
      >
        <ChatSidebar />
      </div>

      {/* Main Content Area */}
      <main
        className={cn(
          "flex-1 overflow-auto relative transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-0" : "md:ml-0", // Sidebar pushes, no need for margin here
        )}
      >
        {/* Universal Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-4 z-20 border-none text-gray-900 dark:text-white"
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="pt-16 h-full">{children}</div> {/* Add padding for the button */}
      </main>
    </div>
  )
}
