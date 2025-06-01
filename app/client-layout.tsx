"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { SignupPopup } from "@/components/signup-popup"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <>
      {children}
      {!user && <SignupPopup />}
    </>
  )
}

export default ClientLayout
