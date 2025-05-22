"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { UserCircle } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [buttonText, setButtonText] = useState("Join")
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)

        // Store login status in localStorage
        if (session?.user) {
          localStorage.setItem("hasLoggedInBefore", "true")
        }

        setLoading(false)
      } catch (error) {
        console.error("Error checking auth status:", error)
        setLoading(false)
      }
    }

    checkUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Alternate button text between Join and Login if not logged in before
  useEffect(() => {
    if (user) return // Don't alternate if logged in

    const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore") === "true"
    if (hasLoggedInBefore) {
      setButtonText("Login")
      return
    }

    const interval = setInterval(() => {
      setButtonText((prev) => (prev === "Join" ? "Login" : "Join"))
    }, 3000)

    return () => clearInterval(interval)
  }, [user])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <button className="bg-gray-300 dark:bg-gray-700 text-transparent px-6 py-2 rounded-full">Loading...</button>
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
            <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt={user.email} />
            <AvatarFallback className="bg-blue-500 text-white">
              {user.email ? user.email.substring(0, 2).toUpperCase() : <UserCircle />}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.email}</div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/security" className="cursor-pointer">
              Security
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 dark:text-red-400">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Link
      href={buttonText === "Join" ? "/auth/sign-up" : "/auth/sign-in"}
      className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-medium transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 hover:shadow-md"
    >
      {buttonText}
    </Link>
  )
}
