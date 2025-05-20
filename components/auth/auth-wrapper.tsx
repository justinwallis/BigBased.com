"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useSession } from "@/contexts/session-provider"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const session = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  // List of protected routes that require authentication
  const protectedRoutes = ["/profile", "/dashboard", "/settings"]

  useEffect(() => {
    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some((route) => pathname?.startsWith(route))

    // If it's a protected route and the user is not authenticated, redirect to login
    if (isProtectedRoute && !isLoading && !user) {
      router.push("/login")
    } else {
      setIsAuthorized(true)
    }
  }, [user, isLoading, pathname, router])

  // Show nothing while checking authentication
  if (!isAuthorized && protectedRoutes.some((route) => pathname?.startsWith(route))) {
    return null
  }

  return <>{children}</>
}
