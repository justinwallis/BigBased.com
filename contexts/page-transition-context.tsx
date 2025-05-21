"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
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

  useEffect(() => {
    // Start transition when pathname changes
    setIsTransitioning(true)

    // End transition after delay
    const timeout = setTimeout(() => {
      setIsTransitioning(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [pathname])

  return <PageTransitionContext.Provider value={{ isTransitioning }}>{children}</PageTransitionContext.Provider>
}
