"use client"

import type React from "react"

import { useMatrixNavigation } from "@/hooks/use-matrix-navigation"

export function MatrixNavigationProvider({ children }: { children: React.ReactNode }) {
  useMatrixNavigation()
  return <>{children}</>
}
