"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { BBLogo } from "@/components/bb-logo"
import { useAuth } from "@/contexts/auth-context"
import { HeaderAuthIntegration } from "@/components/auth/header-auth-integration"
import { NotificationBell } from "@/components/notification-bell"
import { cn } from "@/lib/utils"

const mainNavigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Features", href: "/features" },
  { name: "Revolution", href: "/revolution" },
  { name: "Transform", href: "/transform" },
  { name: "Partners", href: "/partners" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <div className="h-6 w-6 bg-muted animate-pulse rounded" />
              <span className="hidden font-bold sm:inline-block">Big Based</span>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BBLogo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Big Based</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {mainNavigation.map((item) => (
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

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <BBLogo className="h-6 w-6" />
                <span className="font-bold">Big Based</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="flex flex-col gap-3 mt-6">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-2 py-1 text-lg transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-2 py-1 text-lg transition-colors hover:text-foreground/80"
                >
                  Profile
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <BBLogo className="h-6 w-6" />
              <span className="font-bold">Big Based</span>
            </Link>
          </div>
          <nav className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <NotificationBell />
                <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
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
