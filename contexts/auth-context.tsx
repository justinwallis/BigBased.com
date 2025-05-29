"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import type { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { trackSession } from "@/app/actions/session-actions"

interface AuthContextType {
  session: Session | null | undefined
  user: Session["user"] | null | undefined
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<Session["user"] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [status])

  useEffect(() => {
    setUser(session?.user || null)
  }, [session])

  useEffect(() => {
    // Track session when user is authenticated
    if (user && session && !isLoading) {
      trackSession().catch((error) => {
        console.warn("Failed to track session:", error)
      })
    }
  }, [user, session, isLoading])

  return <AuthContext.Provider value={{ session, user, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
