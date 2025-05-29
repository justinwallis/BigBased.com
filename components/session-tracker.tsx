"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { trackSession } from "@/app/actions/session-actions"

export function SessionTracker() {
  const { user, session } = useAuth()

  useEffect(() => {
    if (user && session) {
      // Track session on component mount and when auth state changes
      trackSession().catch((error) => {
        console.warn("Failed to track session:", error)
      })
    }
  }, [user, session])

  // This component doesn't render anything
  return null
}
