"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function PageFadeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Apply fade-in effect when the route changes, but only once per page load
  useEffect(() => {
    // Reset the animation state for new routes
    setHasAnimated(false)
  }, [pathname, searchParams])

  useEffect(() => {
    // Only apply the animation if it hasn't been applied yet for this route
    if (!hasAnimated && wrapperRef.current) {
      setHasAnimated(true)

      // Remove any existing animation classes
      wrapperRef.current.style.animation = "none"
      void wrapperRef.current.offsetWidth // Force reflow

      // Apply the animation
      wrapperRef.current.style.animation = "fadeIn 0.6s ease-out forwards"
    }
  }, [hasAnimated])

  return (
    <div
      ref={wrapperRef}
      style={{
        opacity: hasAnimated ? 1 : 0, // Start invisible until animation is applied
      }}
    >
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      {children}
    </div>
  )
}
