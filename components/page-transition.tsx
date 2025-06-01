"use client"

import { useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { MatrixTransitionEffect } from "./matrix-transition-effect"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [showMatrixTransition, setShowMatrixTransition] = useState(false)
  const [previousPath, setPreviousPath] = useState<string | null>(null)

  useEffect(() => {
    // Skip initial render
    if (previousPath === null) {
      setPreviousPath(pathname)
      return
    }

    // Skip if pathname hasn't changed
    if (previousPath === pathname) return

    // Show matrix transition
    setShowMatrixTransition(true)

    // Hide matrix transition after delay
    const hideTimeout = setTimeout(() => {
      setShowMatrixTransition(false)
    }, 2000)

    // Update previous path
    setPreviousPath(pathname)

    return () => clearTimeout(hideTimeout)
  }, [pathname, previousPath])

  return (
    <>
      {showMatrixTransition && <MatrixTransitionEffect />}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

// Named export
export { PageTransition as default }
