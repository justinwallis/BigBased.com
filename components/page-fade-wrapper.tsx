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
  const animationAppliedRef = useRef(false)

  // Track path changes without triggering re-renders
  useEffect(() => {
    setCurrentPath(`${pathname}?${searchParams}`)
  }, [pathname, searchParams])

  // Reset animation state when path changes
  useEffect(() => {
    if (currentPath) {
      setHasAnimated(false)
      animationAppliedRef.current = false
    }
  }, [currentPath])

  // Apply the animation only once
  useEffect(() => {
    if (!hasAnimated && wrapperRef.current && !animationAppliedRef.current) {
      // Prevent multiple applications of animation
      animationAppliedRef.current = true

      // Determine if we're in dark mode
      const isDarkMode = theme === "dark" || resolvedTheme === "dark"

      // Determine if we're on the main page
      const isMainPage = pathname === "/"

      // Apply different animation durations based on the page
      const duration = isMainPage ? 0.6 : 1.2 // 0.6s for main page, 1.2s for other pages

      // Set the background color based on theme
      const bgColor = isDarkMode ? "#111827" : "#ffffff"

      // Set initial styles immediately to prevent flash
      wrapperRef.current.style.opacity = "0"
      wrapperRef.current.style.backgroundColor = bgColor

      // Use requestAnimationFrame to ensure smooth animation
      requestAnimationFrame(() => {
        if (wrapperRef.current) {
          // Add the controlled-transition class to enable transitions
          wrapperRef.current.classList.add("controlled-transition")

          // Simple transition instead of animation to prevent conflicts
          wrapperRef.current.style.transition = `opacity ${duration}s ease-out`
          wrapperRef.current.style.opacity = "1"

          // Mark as animated after transition completes
          setTimeout(() => {
            setHasAnimated(true)

            // Remove the transition after it completes to prevent conflicts
            if (wrapperRef.current) {
              wrapperRef.current.style.transition = "none"
            }
          }, duration * 1000)
        }
      })
    }
  }, [hasAnimated, pathname, theme, resolvedTheme])

  return (
    <div
      ref={wrapperRef}
      style={{
        opacity: 0, // Start invisible
        position: "relative",
        width: "100%",
        height: "100%",
      }}
      className="page-fade-wrapper"
    >
      {children}
    </div>
  )
}
