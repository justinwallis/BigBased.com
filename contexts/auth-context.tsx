"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

const getSupabaseClient = () => {
  if (!supabaseInstance && typeof window !== "undefined") {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// Define types
type User = {
  id: string
  email?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
  currentAuthTab: "login" | "signup"
  setAuthTab: (tab: "login" | "signup") => void
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentAuthTab, setAuthTab] = useState<"login" | "signup">("login")
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    console.log("AuthProvider initializing...")

    const initAuth = async () => {
      try {
        const supabase = getSupabaseClient()
        if (!supabase) {
          console.error("Supabase client not available")
          setIsLoading(false)
          return
        }

        // Check active session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error getting session:", sessionError)
        }

        if (session?.user) {
          console.log("User is authenticated:", session.user.email)
          setUser({
            id: session.user.id,
            email: session.user.email,
          })
        } else {
          console.log("No authenticated user")
        }

        // Set up auth state listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("Auth state changed:", event)

          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
            })
          } else {
            setUser(null)
          }

          // Refresh the page on auth state change
          router.refresh()
        })

        setIsLoading(false)
        console.log("AuthProvider initialized")

        // Cleanup subscription
        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error in auth initialization:", error)
        setIsLoading(false)
      }
    }

    initAuth()
  }, [router])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        console.error("Supabase client not available")
        return { error: new Error("Supabase client not available") }
      }

      console.log("Signing in with email:", email)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
      } else {
        console.log("Sign in successful")
      }

      return { error }
    } catch (error) {
      console.error("Error signing in:", error)
      return { error }
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        console.error("Supabase client not available")
        return { data: null, error: new Error("Supabase client not available") }
      }

      console.log("Signing up with email:", email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error("Sign up error:", error)
      } else {
        console.log("Sign up successful")
      }

      return { data, error }
    } catch (error) {
      console.error("Error signing up:", error)
      return { data: null, error }
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        console.error("Supabase client not available")
        return
      }

      console.log("Signing out")
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        console.error("Supabase client not available")
        return { error: new Error("Supabase client not available") }
      }

      console.log("Resetting password for email:", email)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error("Password reset error:", error)
      } else {
        console.log("Password reset email sent")
      }

      return { error }
    } catch (error) {
      console.error("Error resetting password:", error)
      return { error }
    }
  }

  // Create context value
  const value = {
    user,
    isLoading,
    showAuthModal,
    setShowAuthModal,
    currentAuthTab,
    setAuthTab,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    console.error("useAuth must be used within an AuthProvider")
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Export Supabase client for direct access when needed
export const supabase = getSupabaseClient()
