"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { SiteHeader } from "@/components/site-header"
import { SignupPopup } from "@/components/signup-popup"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <>
      <SiteHeader />
      {children}
      {!user && <SignupPopup />}
    </>
  )
}

export default ClientLayout
