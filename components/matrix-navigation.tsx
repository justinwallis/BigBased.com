"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"
import { MatrixPageTransition } from "./matrix-page-transition"

export function MatrixNavigation() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [nextPath, setNextPath] = useState<string | null>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Create portal container
  useEffect(() => {
    const container = document.createElement("div")
    container.id = "matrix-transition-portal"
    document.body.appendChild(container)
    setPortalContainer(container)

    return () => {
      document.body.removeChild(container)
    }
  }, [])

  // Intercept link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find if the click was on a link
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

      // Skip if not a link or is an external link or auth page
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("javascript:") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("/auth") ||
        window.location.pathname.startsWith("/auth")
      ) {
        return
      }

      // Prevent default navigation
      e.preventDefault()

      // Skip if already transitioning
      if (isTransitioning) return

      // Start transition
      setIsTransitioning(true)
      setNextPath(href)

      // Navigate after transition
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        router.push(href)

        // Hide transition after a short delay
        setTimeout(() => {
          setIsTransitioning(false)
          setNextPath(null)
        }, 100)
      }, 2500) // Slightly longer than the transition duration
    }

    // Add event listener with capture to intercept before React's event system
    document.addEventListener("click", handleLinkClick, { capture: true })

    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true })
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isTransitioning, router])

  // Render transition in portal
  if (!isTransitioning || !portalContainer) return null

  return createPortal(<MatrixPageTransition />, portalContainer)
}
