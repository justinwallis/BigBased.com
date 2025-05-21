"use client"

import { useEffect, useState } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import JoinButtonConnector from "./join-button-connector"
import AuthButton from "./auth-button"

export default function AuthWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AuthProvider>
      <div className="flex items-center gap-2">
        <AuthButton />
        <JoinButtonConnector />
      </div>
    </AuthProvider>
  )
}
