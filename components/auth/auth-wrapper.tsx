"use client"

import { type ReactNode, useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import auth components with no SSR
const AuthProvider = dynamic(() => import("@/contexts/auth-context").then((mod) => mod.AuthProvider), {
  ssr: false,
})

const GlobalAuthModal = dynamic(() => import("@/components/auth/global-auth-modal"), {
  ssr: false,
})

const JoinButtonConnector = dynamic(() => import("@/components/auth/join-button-connector"), {
  ssr: false,
})

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <AuthProvider>
      <GlobalAuthModal />
      <JoinButtonConnector />
      {children}
    </AuthProvider>
  )
}
