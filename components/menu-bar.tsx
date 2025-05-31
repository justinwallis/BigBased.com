"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Bell, Video, Users, Menu, Home } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export default function MenuBar() {
  const { user: authUser }
  from
  useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme } = useTheme()

  const menuItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Watch", href: "/watch", icon: Video },
    { name: "Groups", href: "/groups", icon: Users },
  ]

  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-2 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Menu Items */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8 mr-2">
              <Image
                src={theme === "dark" ? "/BigBasedIconInvert.png" : "/bb-logo.png"}
                alt="Big Based Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <item.icon className="h-4 w-4 mr-1 inline-block" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {authUser && (
            <Link href="/profile">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image src={authUser?.image || "/placeholder.svg"} alt="User Avatar" fill className="object-cover" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
