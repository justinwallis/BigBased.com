"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

export function MatrixTransitionEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [logoOpacity, setLogoOpacity] = useState(0)
  const animationFrameRef = useRef<number | null>(null)
  const { resolvedTheme } = useTheme()

  // Fade logo in and out
  useEffect(() => {
    // Start with opacity 0
    setLogoOpacity(0)

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

    // Schedule fade out
    const fadeOutTimeout = setTimeout(() => {
      const fadeOutInterval = setInterval(() => {
        opacity -= 0.05
        if (opacity <= 0) {
          clearInterval(fadeOutInterval)
          opacity = 0
          setLogoOpacity(0)
        } else {
          setLogoOpacity(opacity)
        }
      }, 50)

      return () => clearInterval(fadeOutInterval)
    }, 1000)

    return () => {
      clearInterval(fadeInInterval)
      clearTimeout(fadeOutTimeout)
    }
  }, [])

  // Matrix rain effect
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

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
    const animate = () => {
      draw()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 flex items-center justify-center" style={{ opacity: logoOpacity }}>
        <Image
          src="/bb-logo.png"
          alt="Big Based Logo"
          width={120}
          height={120}
          className="h-auto w-auto"
          priority
          style={{
            filter:
              resolvedTheme === "dark"
                ? "drop-shadow(0 0 10px #0f0)" // Green shadow for dark mode
                : "drop-shadow(0 0 10px rgba(0, 0, 0, 0.8))", // Black shadow for light mode
          }}
        />
      </div>
    </div>
  )
}
