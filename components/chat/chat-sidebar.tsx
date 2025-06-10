"use client"

import Link from "next/link"
import { PlusIcon, MessageSquareIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import Image from "next/image"

export function ChatSidebar() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const logoSrc = isDark ? "/BB_Logo_Animation_invert.gif" : "/BB_Logo_Animation.gif"

  return (
    <div className="flex h-full max-h-screen flex-col">
      <div className="flex h-16 items-center justify-between px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Image
            src={logoSrc || "/placeholder.svg"}
            alt="BigBased Logo"
            width={32}
            height={32}
            className="h-8 w-8"
            unoptimized // GIFs are not optimized by Next.js Image component
          />
          <span className="text-lg">BigBased</span>
        </Link>
        <Button className="rounded-full" size="icon" variant="ghost">
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
