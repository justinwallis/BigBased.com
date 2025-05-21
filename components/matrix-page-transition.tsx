"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface MatrixPageTransitionProps {
  onTransitionComplete?: () => void
}

export function MatrixPageTransition({ onTransitionComplete }: MatrixPageTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [showLogo, setShowLogo] = useState(false)
  const { theme, resolvedTheme } = useTheme()
  const isDark = theme === "dark" || resolvedTheme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Get context
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Matrix effect settings
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns)
      .fill(0)
      .map(() => Math.random() * -100)

    // Animation function
    const animate = () => {
      // Clear with semi-transparent background to create trail effect
      ctx.fillStyle = isDark ? "rgba(17, 24, 39, 0.05)" : "rgba(255, 255, 255, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text color and font
      ctx.fillStyle = isDark ? "#0f0" : "#000"
      ctx.font = `${fontSize}px monospace`

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? "1" : "0"
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Reset drop when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Move drop down
        drops[i]++
      }

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Show logo after a delay
    const logoTimer = setTimeout(() => {
      setShowLogo(true)
    }, 1000)

    // Complete transition after animation
    const completionTimer = setTimeout(() => {
      if (onTransitionComplete) {
        onTransitionComplete()
      }
    }, 3000)

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      clearTimeout(logoTimer)
      clearTimeout(completionTimer)
    }
  }, [onTransitionComplete, isDark])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: isDark ? "#111827" : "#ffffff" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      {showLogo && (
        <div className="relative z-10 animate-pulse">
          <img
            src={isDark ? "/BigBasedIconInvert.png" : "/bb-logo.png"}
            alt="Big Based Logo"
            width={120}
            height={120}
            className="h-30 w-30"
          />
        </div>
      )}
    </div>
  )
}
