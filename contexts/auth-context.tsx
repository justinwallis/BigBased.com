"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { cleanupSession, trackSession } from "@/app/actions/session-actions"
import { checkUserMfaStatus, verifyMfaForLogin } from "@/app/actions/mfa-actions"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string, mfaCode?: string) => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: "Auth context not initialized" }),
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

  const signIn = async (email: string, password: string, mfaCode?: string) => {
    try {
      console.log("=== Auth Context SignIn ===")
      console.log("Email:", email)
      console.log("Has MFA Code:", !!mfaCode)

      if (!email || !password) {
        return { error: { message: "Email and password are required" } }
      }

      // First, check if user has MFA enabled
      console.log("Checking MFA status for user...")
      const mfaStatusResult = await checkUserMfaStatus(email)
      console.log("MFA status result:", mfaStatusResult)

      const userHasMfa = mfaStatusResult.success && mfaStatusResult.data?.enabled

      // If user has MFA enabled but no code provided, require MFA
      if (userHasMfa && !mfaCode) {
        console.log("MFA required but no code provided")
        return {
          data: null,
          error: null,
          mfaRequired: true,
        }
      }

      // If user has MFA and code is provided, verify it first
      if (userHasMfa && mfaCode) {
        console.log("Verifying MFA code...")
        const mfaVerifyResult = await verifyMfaForLogin(email, mfaCode)
        console.log("MFA verification result:", mfaVerifyResult)

        if (!mfaVerifyResult.success) {
          return {
            error: { message: mfaVerifyResult.error || "Invalid verification code" },
          }
        }
        console.log("MFA verification successful, proceeding with login...")
      }

      // Proceed with normal login
      console.log("Attempting Supabase signIn...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Supabase signIn error:", error)
        return { error: { message: error.message } }
      }

      console.log("Supabase signIn successful:", {
        user: data.user?.email,
        hasSession: !!data.session,
      })

      return { data, error: null }
    } catch (error: any) {
      console.error("Auth context signIn error:", error)
      return { error: { message: error.message || "An unexpected error occurred" } }
    }
  }

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
        signIn,
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
