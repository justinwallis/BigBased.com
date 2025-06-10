"use client"

import type * as React from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { useTheme } from "next-themes"

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className={`flex h-screen w-full ${isDark ? "bg-darkbg-DEFAULT text-white" : "bg-white text-black"}`}>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col border-r border-gray-200 dark:border-gray-800">
        <ChatSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-10">
          <Button variant="outline" size="icon">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className={`p-0 w-64 ${isDark ? "bg-darkbg-DEFAULT text-white" : "bg-white text-black"}`}
        >
          <ChatSidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
