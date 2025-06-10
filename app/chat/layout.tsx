"use client"

import type * as React from "react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
          "hidden md:flex h-full flex-col transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden",
        )}
      >
        <ChatSidebar />
      </div>

      {/* Main Content Area */}
      <main
        className={cn(
          "flex-1 overflow-auto relative", // Added relative for absolute positioning of toggle
        )}
      >
        {/* Universal Sidebar Toggle Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle for desktop
              className="absolute top-4 left-4 z-20 border-none text-gray-900 dark:text-white" // Ensure visibility
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className={cn("p-0 w-64 border-none", isDark ? "bg-darkbg-DEFAULT text-white" : "bg-white text-black")}
          >
            <ChatSidebar />
          </SheetContent>
        </Sheet>
        <div className="pt-16 h-full">{children}</div> {/* Add padding for the button */}
      </main>
    </div>
  )
}
