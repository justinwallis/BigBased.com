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
      
      .matrix-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 1;
        transition: opacity 0.8s ease-in-out;
      }
      
      .matrix-canvas.fade-out {
        opacity: 0;
      }
    `
    document.head.appendChild(styleElement)

    // Function to create and animate the matrix effect
    const createMatrixEffect = (container: HTMLElement, isDark: boolean) => {
      const canvas = document.createElement("canvas")
      canvas.className = "matrix-canvas"
      container.appendChild(canvas)

      const ctx = canvas.getContext("2d")
      if (!ctx) return { cleanup: () => {}, fadeOut: () => {} }

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
      let isRunning = true

      const animate = () => {
        if (isRunning) {
          draw()
          animationFrame = requestAnimationFrame(animate)
        }
      }
      animate()

      return {
        fadeOut: () => {
          return new Promise<void>((resolve) => {
            canvas.classList.add("fade-out")
            setTimeout(() => {
              isRunning = false
              cancelAnimationFrame(animationFrame)
              resolve()
            }, 800) // Match the CSS transition duration
          })
        },
        cleanup: () => {
          isRunning = false
          cancelAnimationFrame(animationFrame)
          if (container.contains(canvas)) {
            container.removeChild(canvas)
          }
        },
      }
    }

    // Handle link clicks
    const handleLinkClick = async (e: MouseEvent) => {
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

      // Store the href for navigation
      const destinationHref = href

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

      // Create logo image
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

      // Show transition immediately
      transitionContainer.classList.add("visible")

      // Show logo after transition is visible
      await new Promise<void>((resolve) => setTimeout(resolve, 300))
      logoContainer.classList.add("visible")

      // Wait for logo to be visible
      await new Promise<void>((resolve) => setTimeout(resolve, 1500))

      // Hide logo
      logoContainer.classList.remove("visible")

      // Wait for logo to fade out
      await new Promise<void>((resolve) => setTimeout(resolve, 500))

      // Fade out matrix code, leaving just the background
      await matrixEffect.fadeOut()

      // Wait a moment with just the background visible
      await new Promise<void>((resolve) => setTimeout(resolve, 200))

      // Navigate to the new page
      router.push(destinationHref)

      // Clean up after navigation (the background will remain until the new page loads)
      setTimeout(() => {
        matrixEffect.cleanup()
        if (document.body.contains(transitionContainer)) {
          document.body.removeChild(transitionContainer)
        }
        isTransitioningRef.current = false
      }, 500)
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
