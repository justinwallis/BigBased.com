"use client"

import type React from "react"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useAuth } from "@/contexts/auth-context"
import GlobalAuthModal from "./global-auth-modal"
import JoinButtonConnector from "./join-button-connector"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: nextAuthSession } = useSession()
  const { setShowAuthModal } = useAuth()

  // Sync NextAuth session with Supabase auth context if needed
  useEffect(() => {
    // This is where you could sync the NextAuth session with Supabase if needed
    // For now, we'll just keep them separate
  }, [nextAuthSession])

  return (
    <>
      {children}
      <GlobalAuthModal />
      <JoinButtonConnector />
    </>
  )
}
