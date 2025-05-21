"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useTheme } from "next-themes"

export function MatrixPageTransition() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme, systemTheme } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [transitionOpacity, setTransitionOpacity] = useState(0)
  const [logoOpacity, setLogoOpacity] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previousPathRef = useRef<string | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Determine if we're in dark mode
  const isDarkMode = theme === "dark" || (theme === "system" && systemTheme === "dark")

  // Track page changes
  useEffect(() => {
    const currentPath = pathname + searchParams.toString()

    // Skip initial render
    if (previousPathRef.current === null) {
      previousPathRef.current = currentPath
      return
    }

    // Skip if path hasn't changed
    if (previousPathRef.current === currentPath) return

    // Skip transitions between auth pages
    const isAuthPage = (path: string) => path.startsWith("/auth/")
    if (isAuthPage(previousPathRef.current) && isAuthPage(pathname)) {
      previousPathRef.current = currentPath
      return
    }

    // Update previous path
    previousPathRef.current = currentPath

    // Show transition
    setIsVisible(true)
    setLogoOpacity(0)
    setTransitionOpacity(0)

    // Fade in transition
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
    fadeIntervalRef.current = setInterval(() => {
      setTransitionOpacity((prev) => {
        if (prev >= 1) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)

          // Start fading in the logo after the transition is fully visible
          fadeIntervalRef.current = setInterval(() => {
            setLogoOpacity((prevLogo) => {
              if (prevLogo >= 1) {
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
                return 1
              }
              return prevLogo + 0.05
            })
          }, 50)

          return 1
        }
        return prev + 0.05
      })
    }, 30)

    // Hide transition after delay
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    hideTimeoutRef.current = setTimeout(() => {
      // Fade out logo first
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
      fadeIntervalRef.current = setInterval(() => {
        setLogoOpacity((prev) => {
          if (prev <= 0) {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)

            // Then fade out the entire transition
            fadeIntervalRef.current = setInterval(() => {
              setTransitionOpacity((prevTrans) => {
                if (prevTrans <= 0) {
                  if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
                  setIsVisible(false)
                  return 0
                }
                return prevTrans - 0.05
              })
            }, 30)

            return 0
          }
          return prev - 0.05
        })
      }, 50)
    }, 1500)

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [pathname, searchParams])

  // Matrix rain effect
  useEffect(() => {
    if (!isVisible || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Matrix characters
    const chars = "01".split("")

    // Columns for the rain
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)

    // Array to track the y position of each drop
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    // Drawing the characters
    const draw = () => {
      if (!ctx) return

      // Semi-transparent background to create fade effect
      // Use theme-appropriate background color
      ctx.fillStyle = isDarkMode
        ? "rgba(17, 24, 39, 0.05)" // dark:bg-gray-900 with opacity
        : "rgba(255, 255, 255, 0.05)" // white with opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Use theme-appropriate text color
      ctx.fillStyle = isDarkMode ? "#0f0" : "#000" // Green in dark mode, black in light mode
      ctx.font = `${fontSize}px monospace`

      // Loop over drops
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)]

        // x = i * fontSize, y = drops[i] * fontSize
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Sending the drop back to the top randomly after it crosses the screen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Move drops down
        drops[i]++
      }
    }

    // Animation loop
    const animate = () => {
      draw()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isVisible, isDarkMode])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      style={{ opacity: transitionOpacity }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 flex items-center justify-center" style={{ opacity: logoOpacity }}>
        <Image
          src={isDarkMode ? "/bb-logo.png" : "/BigBasedIconInvert.png"}
          alt="Big Based Logo"
          width={120}
          height={120}
          className="h-auto w-auto"
          priority
        />
      </div>
    </div>
  )
}
