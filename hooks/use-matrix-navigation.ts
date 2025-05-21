"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export function useMatrixNavigation() {
  const router = useRouter()
  const isTransitioningRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Create a style element for the matrix transition
    const styleElement = document.createElement("style")
    styleElement.textContent = `
      .matrix-transition {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .matrix-transition.visible {
        opacity: 1;
      }
      
      .matrix-logo {
        position: relative;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
      }
      
      .matrix-logo.visible {
        opacity: 1;
      }
    `
    document.head.appendChild(styleElement)

    // Function to create and animate the matrix effect
    const createMatrixEffect = (container: HTMLElement, isDark: boolean) => {
      const canvas = document.createElement("canvas")
      canvas.style.position = "absolute"
      canvas.style.top = "0"
      canvas.style.left = "0"
      canvas.style.width = "100%"
      canvas.style.height = "100%"
      container.appendChild(canvas)

      const ctx = canvas.getContext("2d")
      if (!ctx) return { cleanup: () => {} }

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const chars = "01"
      const fontSize = 14
      const columns = Math.floor(canvas.width / fontSize)
      const drops: number[] = Array(columns)
        .fill(0)
        .map(() => Math.random() * -100)

      const draw = () => {
        ctx.fillStyle = isDark ? "rgba(17, 24, 39, 0.05)" : "rgba(255, 255, 255, 0.05)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = isDark ? "#0f0" : "#000"
        ctx.font = `${fontSize}px monospace`

        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)]
          ctx.fillText(text, i * fontSize, drops[i] * fontSize)

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0
          }

          drops[i]++
        }
      }

      let animationFrame: number
      const animate = () => {
        draw()
        animationFrame = requestAnimationFrame(animate)
      }
      animate()

      return {
        cleanup: () => {
          cancelAnimationFrame(animationFrame)
          if (container.contains(canvas)) {
            container.removeChild(canvas)
          }
        },
      }
    }

    // Handle link clicks
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
      if (isTransitioningRef.current) return
      isTransitioningRef.current = true

      // Create transition container
      const transitionContainer = document.createElement("div")
      transitionContainer.className = "matrix-transition"
      transitionContainer.style.backgroundColor = document.documentElement.classList.contains("dark")
        ? "#111827" // dark:bg-gray-900
        : "#ffffff" // white
      document.body.appendChild(transitionContainer)

      // Create logo container
      const logoContainer = document.createElement("div")
      logoContainer.className = "matrix-logo"
      transitionContainer.appendChild(logoContainer)

      // Create logo image - SWAPPED LOGOS FOR DARK/LIGHT MODE
      const logoImg = document.createElement("img")
      logoImg.src = document.documentElement.classList.contains("dark")
        ? "/BigBasedIconInvert.png" // Dark mode - use inverted logo (white)
        : "/bb-logo.png" // Light mode - use regular logo (black)
      logoImg.alt = "Big Based Logo"
      logoImg.width = 120
      logoImg.height = 120
      logoContainer.appendChild(logoImg)

      // Start matrix effect
      const isDark = document.documentElement.classList.contains("dark")
      const matrixEffect = createMatrixEffect(transitionContainer, isDark)

      // IMPROVED TIMING: Make sure transition is fully visible before proceeding
      // Show transition immediately
      transitionContainer.classList.add("visible")

      // Ensure the transition is fully visible before showing the logo
      setTimeout(() => {
        logoContainer.classList.add("visible")

        // Navigate after delay
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          // Hide logo
          logoContainer.classList.remove("visible")

          // Hide transition after logo is hidden
          setTimeout(() => {
            // IMPORTANT: Only navigate after transition is fully complete
            const performNavigation = () => {
              // Store the href for navigation
              const destinationHref = href

              // Clean up
              matrixEffect.cleanup()
              document.body.removeChild(transitionContainer)
              isTransitioningRef.current = false

              // Navigate programmatically
              router.push(destinationHref)
            }

            // Wait for transition to complete before navigating
            setTimeout(performNavigation, 300)
          }, 500)
        }, 1500)
      }, 300)
    }

    // Add event listener with capture to intercept before React's event system
    document.addEventListener("click", handleLinkClick, { capture: true })

    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true })
      document.head.removeChild(styleElement)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [router])
}
