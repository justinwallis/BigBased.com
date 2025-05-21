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

      // Remove any existing animation
      wrapperRef.current.style.animation = "none"
      void wrapperRef.current.offsetWidth // Force reflow

      // Apply the animation with the correct background color
      const bgColor = isDarkMode ? "#111827" : "#ffffff"

      // Create a custom animation name based on the background color
      const animationName = isDarkMode ? "fadeInDark" : "fadeInLight"

      // Add the custom animation to the document
      const styleSheet = document.styleSheets[0]
      let animationExists = false

      // Check if the animation already exists
      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i]
        if (rule instanceof CSSKeyframesRule && rule.name === animationName) {
          animationExists = true
          break
        }
      }

      // Add the animation if it doesn't exist
      if (!animationExists) {
        styleSheet.insertRule(
          `@keyframes ${animationName} {
            from { opacity: 0; background-color: ${bgColor}; }
            to { opacity: 1; background-color: ${bgColor}; }
          }`,
          styleSheet.cssRules.length,
        )
      }

      // Apply the animation
      wrapperRef.current.style.animation = `${animationName} ${duration}s ease-out forwards`
      wrapperRef.current.style.backgroundColor = bgColor

      // Mark as animated
      setHasAnimated(true)
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
    >
      {children}
    </div>
  )
}
