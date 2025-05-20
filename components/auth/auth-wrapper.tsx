"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import GlobalAuthModal from "./global-auth-modal"
import JoinButtonConnector from "./join-button-connector"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    console.log("AuthWrapper mounted, user:", user?.email || "none")
  }, [user])

  return (
    <>
      {children}
      <GlobalAuthModal />
      <JoinButtonConnector />
    </>
  )
}
