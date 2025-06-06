"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "next-auth"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface AuthButtonProps {
  user: User | undefined
}

const AuthButton = ({ user }: AuthButtonProps) => {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()

      // Only redirect if we're on a private/protected page
      const currentPath = window.location.pathname
      const privatePaths = ["/profile", "/checkout", "/billing", "/security", "/notifications"]

      const isOnPrivatePage = privatePaths.some((path) => currentPath.startsWith(path))

      if (isOnPrivatePage) {
        router.push("/")
      }
      // Otherwise stay on the current page
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {user?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end" forceMount>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AuthButton
