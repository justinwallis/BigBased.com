"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export function useMatrixNavigation() {
  const router = useRouter()
  const isTransitioningRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { theme, resolvedTheme } = useTheme()

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
        transition: opacity 1.2s ease-in-out; /* Background fade transition */
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        background-color: transparent;
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
      
      .matrix-canvas-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
        background-color: transparent;
      }
      
      .matrix-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0; /* Start invisible */
        transition: opacity 0.8s ease-in-out;
      }
      
      .matrix-canvas.visible {
        opacity: 1;
      }
      
      .matrix-canvas.fade-out {
        opacity: 0;
      }
      
      .matrix-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        opacity: 0;
        transition: opacity 0.6s ease-in-out;
      }
      
      .matrix-background.visible {
        opacity: 1;
      }
    `
    document.head.appendChild(styleElement)

    // Function to create and animate the matrix effect
    const createMatrixEffect = (container: HTMLElement, isDark: boolean) => {
      // Create a separate container for the canvas to allow independent opacity control
      const canvasContainer = document.createElement("div")
      canvasContainer.className = "matrix-canvas-container"
      container.appendChild(canvasContainer)

      const canvas = document.createElement("canvas")
      canvas.className = "matrix-canvas"
      canvasContainer.appendChild(canvas)

      // Create a separate background element
      const background = document.createElement("div")
      background.className = "matrix-background"
      background.style.backgroundColor = isDark ? "#111827" : "#ffffff"
      container.appendChild(background)

      const ctx = canvas.getContext("2d")
      if (!ctx)
        return {
          cleanup: () => {},
          fadeOut: () => {},
          fadeIn: () => {},
          fadeInBackground: () => {},
        }

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
        fadeIn: () => {
          return new Promise<void>((resolve) => {
            canvas.classList.add("visible")
            setTimeout(resolve, 800) // Match the CSS transition duration
          })
        },
        fadeInBackground: () => {
          return new Promise<void>((resolve) => {
            background.classList.add("visible")
            setTimeout(resolve, 600) // Match the CSS transition duration
          })
        },
        fadeOut: () => {
          return new Promise<void>((resolve) => {
            canvas.classList.remove("visible")
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
          if (container.contains(canvasContainer)) {
            container.removeChild(canvasContainer)
          }
          if (container.contains(background)) {
            container.removeChild(background)
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

      // Set initial background color to match current theme to prevent flash
      const isDark = theme === "dark" || resolvedTheme === "dark"
      transitionContainer.style.backgroundColor = "transparent" // Start transparent
      document.body.appendChild(transitionContainer)

      // Make container visible but with transparent background
      transitionContainer.classList.add("visible")

      // Create logo container
      const logoContainer = document.createElement("div")
      logoContainer.className = "matrix-logo"
      transitionContainer.appendChild(logoContainer)

      // Create logo image
      const logoImg = document.createElement("img")
      logoImg.src = isDark
        ? "/BigBasedIconInvert.png" // Dark mode - use inverted logo (white)
        : "/bb-logo.png" // Light mode - use regular logo (black)
      logoImg.alt = "Big Based Logo"
      logoImg.width = 120
      logoImg.height = 120
      logoContainer.appendChild(logoImg)

      // Start matrix effect with separate background
      const matrixEffect = createMatrixEffect(transitionContainer, isDark)

      // First, fade in just the matrix code on a transparent background
      await matrixEffect.fadeIn()

      // Wait a moment to let the matrix code be visible alone
      await new Promise<void>((resolve) => setTimeout(resolve, 800))

      // Show logo after matrix code is visible
      logoContainer.classList.add("visible")

      // Wait for logo to be visible
      await new Promise<void>((resolve) => setTimeout(resolve, 1500))

      // Hide logo
      logoContainer.classList.remove("visible")

      // Wait for logo to fade out
      await new Promise<void>((resolve) => setTimeout(resolve, 500))

      // Fade out matrix code
      await matrixEffect.fadeOut()

      // Now fade in the background at the last moment
      await matrixEffect.fadeInBackground()

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
  }, [router, theme, resolvedTheme])
}
