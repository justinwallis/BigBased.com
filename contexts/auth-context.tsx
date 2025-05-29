"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import { getAuthUser } from "@/app/actions/auth-actions"
import { trackSession } from "@/app/actions/session-actions"

interface AuthContextProps {
  user: User | null
  session: Session | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  setSession: React.Dispatch<React.SetStateAction<Session | null>>
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  setUser: () => {},
  setSession: () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getAuthUser()

      if (data.user && data.session) {
        setUser(data.user)
        setSession(data.session)

        // Track the session
        trackSession().catch((error) => {
          console.warn("Failed to track session:", error)
        })
      } else {
        setUser(null)
        setSession(null)
      }
    }

    fetchUser()
  }, [])

  return <AuthContext.Provider value={{ user, session, setUser, setSession }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
