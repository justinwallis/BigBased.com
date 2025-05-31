"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { TopNavigationBar } from "@/components/top-navigation-bar"
import { SignupPopup } from "@/components/signup-popup"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <>
      {user && <TopNavigationBar />}
      {children}
      {!user && <SignupPopup />}
    </>
  )
}

export default ClientLayout
