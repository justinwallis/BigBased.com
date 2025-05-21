"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"

export function MatrixPageTransition() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [logoOpacity, setLogoOpacity] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previousPathRef = useRef<string | null>(null)

  useEffect(() => {
    // Skip initial render
    if (previousPathRef.current === null) {
      previousPathRef.current = pathname
      return
    }

    // Skip if pathname hasn't changed
    if (previousPathRef.current === pathname) return

    // Update previous path
    previousPathRef.current = pathname

    // Show transition
    setIsVisible(true)

    // Fade in logo
    let opacity = 0
    const fadeInInterval = setInterval(() => {
      opacity += 0.05
      if (opacity >= 1) {
        clearInterval(fadeInInterval)
        opacity = 1
      }
      setLogoOpacity(opacity)
    }, 50)

    // Hide transition after delay
    const hideTimeout = setTimeout(() => {
      // Fade out logo
      const fadeOutInterval = setInterval(() => {
        opacity -= 0.05
        if (opacity <= 0) {
          clearInterval(fadeOutInterval)
          opacity = 0
          setLogoOpacity(0)
          setIsVisible(false)
        } else {
          setLogoOpacity(opacity)
        }
      }, 50)
    }, 1500)

    return () => {
      clearInterval(fadeInInterval)
      clearTimeout(hideTimeout)
    }
  }, [pathname])

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

      // Black semi-transparent background to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0f0" // Green text
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
    let animationId: number
    const animate = () => {
      draw()
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 flex items-center justify-center" style={{ opacity: logoOpacity }}>
        <Image src="/bb-logo.png" alt="Big Based Logo" width={120} height={120} className="h-auto w-auto" priority />
      </div>
    </div>
  )
}
