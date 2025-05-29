"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"
import { trackSession } from "@/app/actions/session-actions"
import { cleanupUserSessions } from "@/app/actions/session-cleanup-actions"

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

          // Track session when user is authenticated
          trackSession().catch((error) => {
            console.warn("Failed to track session:", error)
          })
        }

        // Set up auth state listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          setSession(session)
          setUser(session?.user ?? null)

          // Track session on sign in
          if (event === "SIGNED_IN" && session) {
            try {
              await trackSession()
            } catch (error) {
              console.warn("Failed to track session on sign in:", error)
            }
          }
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
      console.log("=== Auth Context Sign In ===")
      console.log("Email:", email)
      console.log("Has Password:", !!password)
      console.log("Has MFA Code:", !!mfaCode)

      const supabase = supabaseClient()
      if (!supabase) {
        console.error("Supabase client not available")
        return { data: null, error: new Error("Supabase client not available") }
      }

      // First attempt: Password authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Password authentication failed:", error)
        return { data: null, error }
      }

      // Check if MFA is required
      if (data?.session?.factor_challenge && !mfaCode) {
        console.log("MFA required, waiting for code")
        return { data: null, error: null, mfaRequired: true }
      }

      // If MFA code provided, verify it
      if (data?.session?.factor_challenge && mfaCode) {
        console.log("Verifying MFA code")
        const { data: mfaData, error: mfaError } = await supabase.auth.mfa.verify({
          factorId: data.session.factor_challenge.id,
          challengeId: data.session.factor_challenge.challenge_id,
          code: mfaCode,
        })

        if (mfaError) {
          console.error("MFA verification failed:", mfaError)
          return { data: null, error: mfaError }
        }

        // Update session with MFA verified session
        if (mfaData.session) {
          setSession(mfaData.session)
          setUser(mfaData.user)
        }

        console.log("MFA verification successful!")
        return { data: mfaData, error: null }
      }

      // If successful without MFA, update the local state
      if (data.session) {
        setSession(data.session)
        setUser(data.user)

        // Track session on successful sign in
        try {
          await trackSession()
        } catch (trackError) {
          console.warn("Failed to track session after sign in:", trackError)
        }
      }

      console.log("Sign in successful!")
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

      // Get current session before signing out
      const { data: sessionData } = await supabase.auth.getSession()
      const currentToken = sessionData.session?.access_token

      // Sign out from Supabase
      await supabase.auth.signOut()

      // Clean up session from Neon
      if (user?.id && currentToken) {
        try {
          await cleanupUserSessions(user.id, currentToken)
        } catch (error) {
          console.warn("Failed to cleanup session:", error)
        }
      }

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
