"use client"

import type * as React from "react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils" // Assuming cn utility is available

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
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

      {/* Mobile Sidebar (Sheet) */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon" className="border-none">
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

      {/* Main Content Area */}
      <main
        className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-0" : "md:ml-0", // No margin needed, sidebar pushes
        )}
      >
        {/* Desktop Sidebar Toggle Button */}
        <div className="hidden md:block absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="border-none">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>
        {children}
      </main>
    </div>
  )
}
