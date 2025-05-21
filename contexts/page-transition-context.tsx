"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { usePathname } from "next/navigation"

interface PageTransitionContextType {
  isTransitioning: boolean
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  isTransitioning: false,
})

export function usePageTransition() {
  return useContext(PageTransitionContext)
}

interface PageTransitionProviderProps {
  children: ReactNode
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const previousPathRef = useRef<string | null>(null)

  useEffect(() => {
    // Skip initial render
    if (previousPathRef.current === null) {
      previousPathRef.current = pathname
      return
    }

    // Skip if pathname hasn't changed
    if (previousPathRef.current === pathname) return

    // Update previous path
    previousPathRef.current = pathname

    // Start transition
    setIsTransitioning(true)

    // End transition after delay
    const timeout = setTimeout(() => {
      setIsTransitioning(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [pathname])

  return <PageTransitionContext.Provider value={{ isTransitioning }}>{children}</PageTransitionContext.Provider>
}
