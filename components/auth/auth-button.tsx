"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { UserCircle, Settings, HelpCircle, Moon, MessageSquare, LogOut, ChevronRight, ChevronDown } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabaseClient } from "@/lib/supabase/client"
import { getCurrentUserProfile } from "@/app/actions/profile-actions"

interface AuthButtonProps {
  onLogin?: (e: React.FormEvent) => void
  isLoggingIn?: boolean
}

export default function AuthButton({ onLogin, isLoggingIn = false }: AuthButtonProps) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user has visited before
  const hasVisitedBefore = typeof window !== "undefined" ? localStorage.getItem("hasLoggedInBefore") === "true" : false

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

        // Force a fresh check of the session
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking auth status:", error)
          setLoading(false)
          return
        }

        console.log("Auth session data:", data)

        if (data.session?.user) {
          setUser(data.session.user)

          // Get the user's profile from Supabase profiles table
          try {
            const profileData = await getCurrentUserProfile()
            console.log("Profile data from Supabase:", profileData)
            setProfile(profileData)
          } catch (profileError) {
            console.error("Error fetching profile:", profileError)
          }

          // If user logs in, remember this for future visits
          localStorage.setItem("hasLoggedInBefore", "true")
        } else {
          setUser(null)
          setProfile(null)
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

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email)

      if (session?.user) {
        setUser(session.user)

        // Get the user's profile from Supabase profiles table
        try {
          const profileData = await getCurrentUserProfile()
          console.log("Profile data from auth change:", profileData)
          setProfile(profileData)
        } catch (profileError) {
          console.error("Error fetching profile on auth change:", profileError)
        }

        // If user logs in, remember this for future visits
        localStorage.setItem("hasLoggedInBefore", "true")
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = supabaseClient()
    if (!supabase) return

    await supabase.auth.signOut()

    // Only redirect if we're on a private/protected page
    const privatePaths = ["/profile", "/checkout", "/billing", "/security", "/notifications"]
    const isOnPrivatePage = privatePaths.some((path) => pathname.startsWith(path))

    if (isOnPrivatePage) {
      router.push("/")
    }
    // Otherwise stay on the current page
  }

  if (loading) {
    return <div className="w-[140px] h-[36px] bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
  }

  if (user) {
    const displayName = profile?.full_name || profile?.username || user.email?.split("@")[0] || "User"
    const initials = displayName.substring(0, 2).toUpperCase()
    const avatarUrl = profile?.avatar_url

    console.log("Avatar URL from profile:", avatarUrl)

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="relative hover:opacity-80 transition-opacity">
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
            {/* Chevron overlay positioned on bottom right, overlapping halfway */}
            <div className="absolute -bottom-0.5 -right-0.5 bg-white dark:bg-gray-800 rounded-full p-0.5 border border-gray-200 dark:border-gray-600 scale-50">
              <ChevronDown className="h-2 w-2 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-72 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
        >
          {/* User Info Header - Make it clickable and link to profile */}
          <Link href="/profile" className="block">
            <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Avatar className="h-8 w-8 mr-3">
                {avatarUrl ? (
                  <AvatarImage
                    src={avatarUrl || "/placeholder.svg"}
                    alt={displayName}
                    onLoad={() => console.log("Menu avatar loaded successfully")}
                    onError={(e) => {
                      console.error("Menu avatar failed to load:", e.target)
                      console.log("Avatar URL that failed:", avatarUrl)
                    }}
                  />
                ) : null}
                <AvatarFallback className="bg-blue-500 text-white">
                  {user.email ? initials : <UserCircle className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{displayName}</div>
              </div>
            </div>
          </Link>

          {/* Menu Items - Update for light/dark theme */}
          <div className="py-2">
            <DropdownMenuItem
              asChild
              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 text-gray-900 dark:text-white"
            >
              <Link href="/profile/security" className="flex items-center justify-between w-full cursor-pointer">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span>Settings & privacy</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 text-gray-900 dark:text-white"
            >
              <Link href="/contact" className="flex items-center justify-between w-full cursor-pointer">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span>Help & support</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 text-gray-900 dark:text-white"
            >
              <Link href="/profile" className="flex items-center justify-between w-full cursor-pointer">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span>Display & accessibility</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 text-gray-900 dark:text-white cursor-pointer">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                <span>Give feedback</span>
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">⌘ B</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleSignOut}
              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
            >
              <div className="flex items-center">
                <LogOut className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                <span>Log Out</span>
              </div>
            </DropdownMenuItem>
          </div>

          {/* Footer - Update for light/dark theme */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex flex-wrap gap-2 mb-1">
              <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">
                Privacy
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">
                Terms
              </Link>
              <span>·</span>
              <Link href="/contact" className="hover:text-gray-700 dark:hover:text-gray-300">
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
    <div className="flex items-center gap-2">
      <button
        onClick={onLogin}
        disabled={isLoggingIn}
        className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 border border-gray-900 dark:border-gray-100 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
      >
        {isLoggingIn ? "Signing in..." : "Login"}
      </button>
      {hasVisitedBefore ? (
        <Link
          href="/auth/forgot-password"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
        >
          Forgot account?
        </Link>
      ) : (
        <Link
          href="/auth/sign-up"
          className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Register
        </Link>
      )}
    </div>
  )
}
