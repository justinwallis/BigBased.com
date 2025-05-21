"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export function GlobalNavigationInterceptor({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isTransitioningRef = useRef(false)
  const nextPathRef = useRef<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const transitionElementRef = useRef<HTMLDivElement | null>(null)

  // Create a container for the transition
  useEffect(() => {
    // Create transition container if it doesn't exist
    if (!transitionElementRef.current) {
      const transitionContainer = document.createElement("div")
      transitionContainer.id = "matrix-transition-container"
      document.body.appendChild(transitionContainer)
      transitionElementRef.current = transitionContainer
    }

    return () => {
      // Clean up on unmount
      if (transitionElementRef.current) {
        document.body.removeChild(transitionElementRef.current)
        transitionElementRef.current = null
      }
    }
  }, [])

  // Intercept all link clicks
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
      if (isTransitioningRef.current) return

      // Set transitioning state
      isTransitioningRef.current = true
      nextPathRef.current = href

      // Create and mount the transition component
      if (transitionElementRef.current) {
        // Create a new div for this specific transition
        const transitionInstance = document.createElement("div")
        transitionInstance.className = "matrix-transition-instance"
        transitionElementRef.current.appendChild(transitionInstance)

        // Render the matrix transition
        const matrixTransition = document.createElement("div")
        matrixTransition.className = "fixed inset-0 z-[9999] bg-black"
        transitionInstance.appendChild(matrixTransition)

        // Start the matrix animation (simplified version)
        // In a real implementation, you'd use ReactDOM.render or similar
        matrixTransition.innerHTML = `
          <div class="matrix-animation" style="position: absolute; inset: 0; background-color: ${
            document.documentElement.classList.contains("dark") ? "#111827" : "#ffffff"
          }">
            <canvas id="matrix-canvas" style="position: absolute; inset: 0;"></canvas>
            <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; height: 100%;">
              <img src="${
                document.documentElement.classList.contains("dark") ? "/bb-logo.png" : "/BigBasedIconInvert.png"
              }" alt="Big Based Logo" width="120" height="120" style="opacity: 0; transition: opacity 0.5s ease-in-out; filter: ${
                document.documentElement.classList.contains("dark")
                  ? "drop-shadow(0 0 10px #0f0)"
                  : "drop-shadow(0 0 10px rgba(0, 0, 0, 0.8))"
              };">
            </div>
          </div>
        `

        // Get the canvas and start the matrix animation
        const canvas = document.getElementById("matrix-canvas") as HTMLCanvasElement
        if (canvas) {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            // Matrix animation code (simplified)
            const isDark = document.documentElement.classList.contains("dark")
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

            // Fade in the transition
            matrixTransition.style.opacity = "0"
            matrixTransition.style.transition = "opacity 0.3s ease-in-out"
            setTimeout(() => {
              matrixTransition.style.opacity = "1"

              // Fade in the logo after a delay
              setTimeout(() => {
                const logo = matrixTransition.querySelector("img")
                if (logo) {
                  logo.style.opacity = "1"
                }

                // Start the matrix animation
                let animationFrame: number
                const animate = () => {
                  draw()
                  animationFrame = requestAnimationFrame(animate)
                }
                animate()

                // Navigate after the transition
                if (timeoutRef.current) clearTimeout(timeoutRef.current)
                timeoutRef.current = setTimeout(() => {
                  // Fade out the logo
                  if (logo) {
                    logo.style.opacity = "0"
                  }

                  // Fade out the transition
                  setTimeout(() => {
                    matrixTransition.style.opacity = "0"

                    // Clean up and navigate
                    setTimeout(() => {
                      cancelAnimationFrame(animationFrame)
                      if (transitionInstance.parentNode) {
                        transitionInstance.parentNode.removeChild(transitionInstance)
                      }
                      isTransitioningRef.current = false

                      // Navigate to the next page
                      if (nextPathRef.current) {
                        router.push(nextPathRef.current)
                        nextPathRef.current = null
                      }
                    }, 300)
                  }, 500)
                }, 1500)
              }, 300)
            }, 10)
          }
        }
      }
    }

    // Add event listener
    document.addEventListener("click", handleLinkClick, { capture: true })

    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true })
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [router])

  return <>{children}</>
}
