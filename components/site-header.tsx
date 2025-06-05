"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BBLogo } from "@/components/bb-logo"
import { useAuth } from "@/contexts/auth-context"
import { HeaderAuthIntegration } from "@/components/auth/header-auth-integration"
import { NotificationBell } from "@/components/notification-bell"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Features", href: "/features" },
  { name: "Revolution", href: "/revolution" },
  { name: "Transform", href: "/transform" },
  { name: "Contact", href: "/contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BBLogo className="h-8 w-8" />
            <span className="hidden font-bold sm:inline-block">Big Based</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* Search could go here */}</div>
          <nav className="flex items-center space-x-2">
            {isAuthenticated && (
              <>
                <NotificationBell />
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">Profile</Link>
                </Button>
              </>
            )}
            <HeaderAuthIntegration />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
