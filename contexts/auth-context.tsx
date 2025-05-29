"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { cleanupSession, trackSession } from "@/app/actions/session-actions"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession()

        if (initialSession) {
          setSession(initialSession)
          setUser(initialSession.user)
          // Track this session
          await trackSession()
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event, newSession?.user?.email)

      if (event === "SIGNED_IN" && newSession) {
        setSession(newSession)
        setUser(newSession.user)
        setIsLoading(false)
        // Track new session
        await trackSession()
      } else if (event === "SIGNED_OUT") {
        // Clean up session before clearing state
        if (session?.access_token) {
          await cleanupSession(session.access_token)
        }
        setSession(null)
        setUser(null)
        setIsLoading(false)
      } else if (event === "TOKEN_REFRESHED" && newSession) {
        setSession(newSession)
        setUser(newSession.user)
        // Update session tracking with new token
        await trackSession()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signOut = async () => {
    try {
      // Clean up session before signing out
      if (session?.access_token) {
        await cleanupSession(session.access_token)
      }

      // Sign out from Supabase
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
