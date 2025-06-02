"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { UserCircle, Settings, HelpCircle, Moon, MessageSquare, LogOut, ChevronRight } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
            <AvatarImage src={user.user_metadata?.avatar_url || user.user_metadata?.picture || ""} alt={user.email} />
            <AvatarFallback className="bg-blue-500 text-white">
              {user.user_metadata?.full_name ? (
                user.user_metadata.full_name.substring(0, 2).toUpperCase()
              ) : user.email ? (
                user.email.substring(0, 2).toUpperCase()
              ) : (
                <UserCircle className="h-5 w-5" />
              )}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-72 bg-gray-900 dark:bg-gray-900 border-gray-700 dark:border-gray-700 text-white"
        >
          {/* User Info Header */}
          <div className="flex items-center px-4 py-3 border-b border-gray-700">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage
                src={user.user_metadata?.avatar_url || user.user_metadata?.picture || ""}
                alt={user.user_metadata?.full_name || user.email}
              />
              <AvatarFallback className="bg-blue-500 text-white">
                {user.user_metadata?.full_name ? (
                  user.user_metadata.full_name.substring(0, 2).toUpperCase()
                ) : user.email ? (
                  user.email.substring(0, 2).toUpperCase()
                ) : (
                  <UserCircle className="h-5 w-5" />
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-white">
                {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <DropdownMenuItem asChild className="px-4 py-3 hover:bg-gray-800 focus:bg-gray-800 text-white">
              <Link href="/profile/security" className="flex items-center justify-between w-full cursor-pointer">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Settings & privacy</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="px-4 py-3 hover:bg-gray-800 focus:bg-gray-800 text-white">
              <Link href="/contact" className="flex items-center justify-between w-full cursor-pointer">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Help & support</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="px-4 py-3 hover:bg-gray-800 focus:bg-gray-800 text-white">
              <Link href="/profile" className="flex items-center justify-between w-full cursor-pointer">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Display & accessibility</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="px-4 py-3 hover:bg-gray-800 focus:bg-gray-800 text-white cursor-pointer">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-3 text-gray-400" />
                <span>Give feedback</span>
                <span className="ml-auto text-xs text-gray-400">⌘ B</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleSignOut}
              className="px-4 py-3 hover:bg-gray-800 focus:bg-gray-800 text-white cursor-pointer"
            >
              <div className="flex items-center">
                <LogOut className="h-5 w-5 mr-3 text-gray-400" />
                <span>Log Out</span>
              </div>
            </DropdownMenuItem>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-700 text-xs text-gray-400">
            <div className="flex flex-wrap gap-2 mb-1">
              <Link href="/privacy" className="hover:text-gray-300">
                Privacy
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-gray-300">
                Terms
              </Link>
              <span>·</span>
              <Link href="/contact" className="hover:text-gray-300">
                More
              </Link>
            </div>
            <div>© 2025</div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Link
      href={buttonText === "Join" ? "/auth/sign-up" : "/auth/sign-in"}
      className="inline-block min-w-[90px] text-center bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-medium transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 hover:shadow-md"
    >
      <span
        className={`inline-block transition-opacity duration-300 ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}
      >
        {buttonText}
      </span>
    </Link>
  )
}
