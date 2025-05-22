"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { UserCircle } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabaseClient } from "@/lib/supabase/client"

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [buttonText, setButtonText] = useState("")
  const [fadeState, setFadeState] = useState("fade-in")

  // Force a more reliable check for authentication status
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = supabaseClient()
        if (!supabase) {
          console.error("No Supabase client available")
          setLoading(false)
          return
        }

        // Check if user has logged in before
        const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore") === "true"
        if (hasLoggedInBefore) {
          setButtonText("Login")
        } else {
          setButtonText("Join")
        }

        // Force a fresh check of the session
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking auth status:", error)
          setLoading(false)
          return
        }

        console.log("Auth session data:", data)
        setUser(data.session?.user || null)

        // If user logs in, remember this for future visits
        if (data.session?.user) {
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
    const supabase = supabaseClient()
    if (!supabase) return

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email)
      setUser(session?.user || null)

      // If user logs in, remember this for future visits
      if (session?.user) {
        localStorage.setItem("hasLoggedInBefore", "true")
      }
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  // Alternate button text between Join and Login if not logged in and never logged in before
  useEffect(() => {
    if (user) return // Don't alternate if logged in

    const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore") === "true"
    if (hasLoggedInBefore) {
      setButtonText("Login")
      return // Don't alternate if they've logged in before
    }

    const interval = setInterval(() => {
      // Start fade out
      setFadeState("fade-out")

      // After fade out completes, change text and fade in
      setTimeout(() => {
        setButtonText((prev) => (prev === "Join" ? "Login" : "Join"))
        setFadeState("fade-in")
      }, 300) // Match this with the CSS transition duration
    }, 3000)

    return () => clearInterval(interval)
  }, [user])

  const handleSignOut = async () => {
    const supabase = supabaseClient()
    if (!supabase) return

    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (loading) {
    return <div className="w-[90px] h-[40px] bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
            <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={user.email} />
            <AvatarFallback className="bg-blue-500 text-white">
              {user.email ? user.email.substring(0, 2).toUpperCase() : <UserCircle className="h-5 w-5" />}
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
      className={`inline-block min-w-[90px] text-center bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-medium transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 hover:shadow-md ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}
      style={{ transition: "opacity 300ms ease-in-out" }}
    >
      {buttonText}
    </Link>
  )
}
