"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth-actions"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { supabaseClient } from "@/lib/supabase/client"
import JoinButton from "./join-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserCircle } from "lucide-react"

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = supabaseClient()
        if (!supabase) {
          setIsLoading(false)
          return
        }

        const { data } = await supabase.auth.getSession()
        if (data.session) {
          setUser(data.session.user)
          // Store that user has logged in before
          localStorage.setItem("hasLoggedIn", "true")
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Error checking session:", error)
        setIsLoading(false)
      }
    }

    checkSession()

    // Set up auth state listener
    const supabase = supabaseClient()
    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        localStorage.setItem("hasLoggedIn", "true")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (user) {
    // Get initials from email
    const email = user.email || ""
    const initials = email.substring(0, 2).toUpperCase()

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-full p-0 h-8 w-8">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url || ""} alt="Profile" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials || <UserCircle className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Open user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/security">Security</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/auth/sign-in">Sign In</Link>
      </Button>
      <JoinButton />
    </div>
  )
}
