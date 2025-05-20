"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import AuthModal from "./auth-modal"

export default function GlobalAuthModal() {
  const { showAuthModal, setShowAuthModal, currentAuthTab } = useAuth()

  // Debug logging
  useEffect(() => {
    console.log("GlobalAuthModal mounted, showAuthModal:", showAuthModal)

    return () => {
      console.log("GlobalAuthModal unmounted")
    }
  }, [])

  // Log when modal state changes
  useEffect(() => {
    console.log("Auth modal state changed:", showAuthModal)
  }, [showAuthModal])

  const handleClose = () => {
    console.log("Closing auth modal")
    setShowAuthModal(false)
  }

  return <AuthModal isOpen={showAuthModal} onClose={handleClose} defaultTab={currentAuthTab} />
}
