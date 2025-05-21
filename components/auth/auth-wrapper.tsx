"use client"

import type { ReactNode } from "react"
import JoinButtonConnector from "./join-button-connector"

interface AuthWrapperProps {
  children: ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <>
      {children}
      <JoinButtonConnector />
    </>
  )
}
