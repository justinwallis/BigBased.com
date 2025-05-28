"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: any | null
  isLoading: boolean
  signIn: (email: string, password: string, mfaCode?: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = supabaseClient()
    if (!supabase) {
      setIsLoading(false)
      return
    }

    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
        }
        setUser(data?.session?.user || null)
      } catch (error) {
        console.error("Error checking user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string, mfaCode?: string) => {
    try {
      const supabase = supabaseClient()
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // First, check if user has MFA enabled
      if (!mfaCode) {
        // Try to sign in first to validate credentials
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          return { error: signInError }
        }

        // Check if user has MFA enabled
        const response = await fetch("/api/auth/check-mfa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        const { data: mfaData } = await response.json()

        if (mfaData?.enabled) {
          // If MFA is enabled but no code provided, sign out and require MFA
          await supabase.auth.signOut()
          return { mfaRequired: true }
        }

        // If no MFA, return the sign in data
        return { data: signInData }
      } else {
        // If MFA code is provided, verify it
        const response = await fetch("/api/auth/verify-mfa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, token: mfaCode }),
        })

        const { success, error } = await response.json()

        if (!success) {
          return { error: { message: error || "Invalid verification code" } }
        }

        // If MFA verification succeeded, sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          return { error: signInError }
        }

        return { data: signInData }
      }
    } catch (error: any) {
      console.error("Sign in error:", error)
      return { error: { message: error.message || "An unexpected error occurred" } }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const supabase = supabaseClient()
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      return { data, error }
    } catch (error: any) {
      console.error("Sign up error:", error)
      return { error: { message: error.message || "An unexpected error occurred" } }
    }
  }

  const signOut = async () => {
    try {
      const supabase = supabaseClient()
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      await supabase.auth.signOut()
      router.push("/auth/sign-in")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const supabase = supabaseClient()
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      return { data, error }
    } catch (error: any) {
      console.error("Reset password error:", error)
      return { error: { message: error.message || "An unexpected error occurred" } }
    }
  }

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
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
