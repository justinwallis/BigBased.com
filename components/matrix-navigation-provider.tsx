"use client"

import type React from "react"
import { createContext, useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

interface MatrixNavigationContextType {
  isTransitioning: boolean
  startTransition: (path: string) => void
  endTransition: () => void
}

export const MatrixNavigationContext = createContext<MatrixNavigationContextType>({
  isTransitioning: false,
  startTransition: () => {},
  endTransition: () => {},
})

export function MatrixNavigationProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [nextPath, setNextPath] = useState<string | null>(null)
  const pathname = usePathname()
  const { theme } = useTheme()
  const initialRenderRef = useRef(true)
  const isDarkMode = theme === "dark"
  const bgColor = isDarkMode ? "#111827" : "#ffffff"

  // Reset transition state when path changes
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }

    setIsTransitioning(false)
    setNextPath(null)
  }, [pathname])

  const startTransition = (path: string) => {
    setIsTransitioning(true)
    setNextPath(path)
  }

  const endTransition = () => {
    setIsTransitioning(false)
    setNextPath(null)
  }

  return (
    <MatrixNavigationContext.Provider value={{ isTransitioning, startTransition, endTransition }}>
      <div style={{ backgroundColor: bgColor, minHeight: "100vh" }}>{children}</div>
    </MatrixNavigationContext.Provider>
  )
}
