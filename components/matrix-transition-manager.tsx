"use client"

import type React from "react"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { MatrixPageTransition } from "./matrix-page-transition"

export function MatrixTransitionManager({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [nextPath, setNextPath] = useState<string | null>(null)
  const [shouldNavigate, setShouldNavigate] = useState(false)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const clickHandlerAttachedRef = useRef(false)

  // Handle the end of transition
  const handleTransitionEnd = useCallback(() => {
    if (nextPath && shouldNavigate) {
      // Actually navigate to the next page
      router.push(nextPath)

      // Reset state
      setNextPath(null)
      setShouldNavigate(false)

      // Hide transition after a short delay to ensure smooth transition
      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    } else {
      setIsTransitioning(false)
    }
  }, [nextPath, shouldNavigate, router])

  // Intercept link clicks
  useEffect(() => {
    if (clickHandlerAttachedRef.current) return

    const handleLinkClick = (e: MouseEvent) => {
      // Find if the click was on a link or inside a link
      let target = e.target as HTMLElement | null
      let href: string | null = null

      // Traverse up to find the closest anchor tag
      while (target && !href) {
        if (target.tagName === "A") {
          href = target.getAttribute("href")
          break
        }
        target = target.parentElement
      }

      // If it's an internal link and not an auth page transition
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/auth") &&
        !(window.location.pathname.startsWith("/auth") && href.startsWith("/auth"))
      ) {
        e.preventDefault()

        // Show transition
        setIsTransitioning(true)
        setNextPath(href)

        // Schedule navigation after transition duration
        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
        transitionTimeoutRef.current = setTimeout(() => {
          setShouldNavigate(true)
        }, 2000) // Match this with your transition duration
      }
    }

    // Add event listener
    document.addEventListener("click", handleLinkClick)
    clickHandlerAttachedRef.current = true

    return () => {
      document.removeEventListener("click", handleLinkClick)
      clickHandlerAttachedRef.current = false
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current)
    }
  }, [router])

  return (
    <>
      {children}
      {isTransitioning && <MatrixPageTransition onTransitionComplete={handleTransitionEnd} />}
    </>
  )
}
