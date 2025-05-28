"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import type { User, Session, AuthError } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (
    email: string,
    password: string,
    mfaCode?: string,
  ) => Promise<{
    data?: { session: Session | null; user: User | null }
    error?: AuthError | null
    mfaRequired?: boolean
  }>
  signUp: (
    email: string,
    password: string,
  ) => Promise<{
    data?: any
    error?: AuthError | null
  }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{
    data?: any
    error?: AuthError | null
  }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error("Error refreshing session:", error)
      } else {
        console.log("Session refreshed successfully")
      }
    } catch (error) {
      console.error("Error in refreshSession:", error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        console.log("Initial session:", session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)

      // Force a page refresh on sign in to sync server state
      if (event === "SIGNED_IN" && session) {
        console.log("User signed in, refreshing page to sync server state")
        window.location.reload()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string, mfaCode?: string) => {
    try {
      console.log("=== Sign In Attempt ===")
      console.log("Email:", email)
      console.log("Has MFA Code:", !!mfaCode)

      // First, check if user has MFA enabled
      if (!mfaCode) {
        console.log("Checking MFA status...")
        const mfaCheckResponse = await fetch("/api/auth/check-mfa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        const mfaCheckResult = await mfaCheckResponse.json()
        console.log("MFA Check Result:", mfaCheckResult)

        if (mfaCheckResult.success && mfaCheckResult.data.enabled) {
          console.log("MFA is enabled for this user, requiring MFA code")
          return {
            error: null,
            mfaRequired: true,
          }
        }
      }

      // If MFA code is provided, verify it first
      if (mfaCode) {
        console.log("Verifying MFA code...")
        const mfaVerifyResponse = await fetch("/api/auth/verify-mfa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, token: mfaCode }),
        })

        const mfaVerifyResult = await mfaVerifyResponse.json()
        console.log("MFA Verify Result:", mfaVerifyResult)

        if (!mfaVerifyResult.success) {
          return {
            error: { message: mfaVerifyResult.error || "Invalid MFA code" } as AuthError,
            mfaRequired: true,
          }
        }
      }

      // Proceed with normal sign in
      console.log("Proceeding with Supabase sign in...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Supabase sign in result:", { data: !!data, error })

      if (error) {
        return { error }
      }

      // Force session refresh after successful login
      await refreshSession()

      return { data, error: null }
    } catch (err) {
      console.error("Sign in error:", err)
      return {
        error: { message: "An unexpected error occurred" } as AuthError,
      }
    }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Sign out error:", error)
    } else {
      // Force page refresh to clear server state
      window.location.href = "/"
    }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { data, error }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
