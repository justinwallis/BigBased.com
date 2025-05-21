"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"

export function PageFadeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [currentPath, setCurrentPath] = useState("")
  const { theme, resolvedTheme } = useTheme()

  // Track path changes without triggering re-renders
  useEffect(() => {
    setCurrentPath(`${pathname}?${searchParams}`)
  }, [pathname, searchParams])

  // Reset animation state when path changes
  useEffect(() => {
    if (currentPath) {
      setHasAnimated(false)
    }
  }, [currentPath])

  // Apply the animation only once
  useEffect(() => {
    if (!hasAnimated && wrapperRef.current) {
      // Determine if we're in dark mode
      const isDarkMode = theme === "dark" || resolvedTheme === "dark"

      // Determine if we're on the main page
      const isMainPage = pathname === "/"

      // Apply different animation durations based on the page
      const duration = isMainPage ? 0.6 : 1.2 // 0.6s for main page, 1.2s for other pages

      // Set the initial background color to match the theme
      document.body.style.backgroundColor = isDarkMode ? "#111827" : "#ffffff"

      // Remove any existing animation
      wrapperRef.current.style.animation = "none"
      void wrapperRef.current.offsetWidth // Force reflow

      // Apply the animation
      wrapperRef.current.style.animation = `fadeIn ${duration}s ease-out forwards`

      // Mark as animated
      setHasAnimated(true)
    }
  }, [hasAnimated, pathname, theme, resolvedTheme])

  return (
    <div
      ref={wrapperRef}
      style={{
        opacity: 0, // Start invisible
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
