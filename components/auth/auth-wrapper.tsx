"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  session: Session | null
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const nextAuthSession = useSession()

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
        } else {
          setSession(data.session)
          setUser(data.session?.user || null)
        }
      } catch (error) {
        console.error("Unexpected error during getSession:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  // Sync with NextAuth session if available
  useEffect(() => {
    if (nextAuthSession.status === "authenticated" && nextAuthSession.data?.user) {
      // If we have a NextAuth session but no Supabase session, we could
      // potentially sync them here if needed
    }
  }, [nextAuthSession])

  const value = {
    session,
    user,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
