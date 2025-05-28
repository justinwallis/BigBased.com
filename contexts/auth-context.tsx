"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
  setAuthTab: (tab: "login" | "signup") => void
  currentAuthTab: "login" | "signup"
  signUp: (
    email: string,
    password: string,
  ) => Promise<{
    error: any | null
    data: any | null
  }>
  signIn: (
    email: string,
    password: string,
    mfaCode?: string,
  ) => Promise<{
    error: any | null
    data: any | null
    mfaRequired?: boolean
  }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentAuthTab, setAuthTab] = useState<"login" | "signup">("login")
  const [isClient, setIsClient] = useState(false)

  // Only run on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Skip if not client side yet
    if (!isClient) return

    // Get session from storage
    const initializeAuth = async () => {
      try {
        setIsLoading(true)

        // Get the Supabase client instance
        const supabase = supabaseClient()

        // If supabase client is null, skip initialization
        if (!supabase) {
          console.warn("Supabase client not available")
          setIsLoading(false)
          return
        }

        // Check for active session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error retrieving session:", error.message)
        }

        if (session) {
          setSession(session)
          setUser(session.user)
        }

        // Set up auth state listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
        })

        setIsLoading(false)

        // Cleanup subscription
        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error in auth initialization:", error)
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [isClient])

  const signUp = async (email: string, password: string) => {
    try {
      const supabase = supabaseClient()
      if (!supabase) {
        console.error("Supabase client not available")
        return { data: null, error: new Error("Supabase client not available") }
      }

      return await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"}/auth/callback`,
        },
      })
    } catch (error) {
      console.error("Error in signUp:", error)
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string, mfaCode?: string) => {
    try {
      const supabase = supabaseClient()
      if (!supabase) {
        console.error("Supabase client not available")
        return { data: null, error: new Error("Supabase client not available") }
      }

      // Sign in with password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Error in signIn:", error)
        return { data: null, error }
      }

      // If MFA is required, return mfaRequired flag
      if (data?.session?.factor_challenge) {
        return { data: null, error: null, mfaRequired: true }
      }

      // If successful, update the local state
      if (data.session) {
        setSession(data.session)
        setUser(data.user)
      }

      return { data, error: null }
    } catch (error) {
      console.error("Error in signIn:", error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const supabase = supabaseClient()
      if (!supabase) {
        console.error("Supabase client not available")
        return
      }

      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error("Error in signOut:", error)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    showAuthModal,
    setShowAuthModal,
    currentAuthTab,
    setAuthTab,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
