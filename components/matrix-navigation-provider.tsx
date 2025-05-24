"use client"

import type React from "react"

import { useMatrixNavigation } from "@/hooks/use-matrix-navigation"

export function MatrixNavigationProvider({ children }: { children: React.ReactNode }) {
  // Initialize the matrix navigation hook
  useMatrixNavigation()

  return <>{children}</>
}
