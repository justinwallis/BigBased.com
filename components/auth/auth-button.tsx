"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { UserCircle, ChevronDown } from "lucide-react"

export default function AuthButton() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut({ redirect: false })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (user) {
    const avatarUrl = user.image
    const displayName = user.name || user.email || "User"
    const initials = user.email ? user.email[0].toUpperCase() : "U"
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800">
              {avatarUrl ? (
                <AvatarImage
                  src={avatarUrl || "/placeholder.svg"}
                  alt={displayName}
                  onLoad={() => console.log("Header avatar loaded successfully")}
                  onError={(e) => {
                    console.error("Header avatar failed to load:", e.target)
                    console.log("Avatar URL that failed:", avatarUrl)
                  }}
                />
              ) : null}
              <AvatarFallback className="bg-blue-500 text-white">
                {user.email ? initials : <UserCircle className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="absolute -bottom-1 -right-1 h-4 w-4 bg-white dark:bg-gray-900 rounded-full p-0.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/billing">Billing</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/security">Security</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" disabled={isSigningOut} onClick={handleSignOut}>
            {isSigningOut ? "Signing out..." : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href="/auth/sign-in">Sign in</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  )
}
