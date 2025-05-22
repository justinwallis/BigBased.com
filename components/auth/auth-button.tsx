"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth-actions"
import { useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/supabase/client"

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  // Add console logs to debug
  console.log("AuthButton rendering, isLoggedIn:", isLoggedIn)

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log("Checking auth status...")
        const supabase = supabaseClient()
        if (!supabase) {
          console.log("No Supabase client available")
          setIsLoading(false)
          return
        }

        const { data, error } = await supabase.auth.getSession()
        console.log("Auth session data:", data, "Error:", error)

        if (data.session) {
          console.log("User is logged in:", data.session.user.email)
          setIsLoggedIn(true)
          setUserEmail(data.session.user.email || "")
        } else {
          console.log("No active session found")
          setIsLoggedIn(false)
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Error checking auth:", error)
        setIsLoading(false)
      }
    }

    checkAuth()

    // Set up auth listener
    const supabase = supabaseClient()
    if (!supabase) return

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setIsLoggedIn(!!session)
      setUserEmail(session?.user?.email || "")
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      console.log("Signing out...")
      await signOut()
      setIsLoggedIn(false)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (isLoading) {
    return <Button disabled>Loading...</Button>
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          {userEmail.substring(0, 10)}
        </Button>
        <Button variant="destructive" size="sm" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href="/auth/sign-in">Sign In</Link>
      </Button>
      <Button variant="default" size="sm" asChild>
        <Link href="/auth/sign-up">Join</Link>
      </Button>
    </div>
  )
}
