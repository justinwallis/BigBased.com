"use client"

import type React from "react"
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
