"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

// Define the session types to match NextAuth's interface
type Session = {
  user: {
    name?: string
    email?: string
    image?: string
    id?: string
  } | null
  expires: string
}

type SessionContextValue = {
  data: Session | null
  status: "loading" | "authenticated" | "unauthenticated"
  update: (data?: Session | null) => Promise<Session | null>
}

// Create the session context
const SessionContext = createContext<SessionContextValue>({
  data: null,
  status: "loading",
  update: async () => null,
})

// Create the SessionProvider component
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  // Update session based on Supabase auth
  useEffect(() => {
    if (isLoading) {
      setStatus("loading")
    } else if (user) {
      const newSession: Session = {
        user: {
          id: user.id,
          email: user.email,
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      }
      setSession(newSession)
      setStatus("authenticated")
    } else {
      setSession(null)
      setStatus("unauthenticated")
    }
  }, [user, isLoading])

  // Mock update function
  const update = async (data?: Session | null) => {
    if (data) {
      setSession(data)
      return data
    }
    return session
  }

  return <SessionContext.Provider value={{ data: session, status, update }}>{children}</SessionContext.Provider>
}

// Create a useSession hook that matches NextAuth's interface
export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
