"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface FloatingShape {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  rotation: number
  rotationSpeed: number
  type: "circle" | "hexagon" | "triangle"
  pulsePhase: number
}

export function AboutSectionBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const shapesRef = useRef<FloatingShape[]>([])
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      // Ensure minimum size
      canvas.width = Math.max(canvas.width, 300)
      canvas.height = Math.max(canvas.height, 200)

      console.log("Canvas dimensions:", canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize floating shapes
    const initShapes = () => {
      shapesRef.current = []
      const shapeCount = Math.floor((canvas.width * canvas.height) / 15000) // Much fewer shapes

      for (let i = 0; i < shapeCount; i++) {
        const types: ("circle" | "hexagon" | "triangle")[] = ["circle", "hexagon", "triangle"]

        shapesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5, // Much slower movement
          vy: (Math.random() - 0.5) * 0.5,
          size: 30 + Math.random() * 60,
          opacity: 0.1 + Math.random() * 0.15, // Very subtle
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.005, // Very slow rotation
          type: types[Math.floor(Math.random() * types.length)],
          pulsePhase: Math.random() * Math.PI * 2,
        })
      }
    }

    // Draw subtle grid pattern
    const drawSubtleGrid = () => {
      const isDark = resolvedTheme === "dark"
      const time = Date.now() * 0.0005 // Very slow animation

      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"
      ctx.lineWidth = 1

      const gridSize = 80
      const offset = Math.sin(time) * 2 // Gentle breathing effect

      // Vertical lines with subtle movement
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x + offset, 0)
        ctx.lineTo(x + offset, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines with subtle movement
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y + offset)
        ctx.lineTo(canvas.width, y + offset)
        ctx.stroke()
      }
    }

    // Draw gentle gradient waves
    const drawGradientWaves = () => {
      const isDark = resolvedTheme === "dark"
      const time = Date.now() * 0.0003

      // Create subtle wave patterns
      for (let i = 0; i < 3; i++) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)

        if (isDark) {
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.03)")
          gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.06)")
          gradient.addColorStop(1, "rgba(255, 255, 255, 0.03)")
        } else {
          gradient.addColorStop(0, "rgba(0, 0, 0, 0.03)")
          gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.06)")
          gradient.addColorStop(1, "rgba(0, 0, 0, 0.03)")
        }

        ctx.fillStyle = gradient

        const waveHeight = 100 + Math.sin(time + i) * 20
        const waveY = (canvas.height / 4) * (i + 1) + Math.sin(time * 0.5 + i) * 30

        ctx.beginPath()
        ctx.moveTo(0, waveY)

        for (let x = 0; x <= canvas.width; x += 10) {
          const y = waveY + Math.sin(x * 0.01 + time + i) * waveHeight * 0.1
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        ctx.fill()
      }
    }

    // Draw hexagon
    const drawHexagon = (x: number, y: number, size: number, rotation: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + rotation
        const px = x + Math.cos(angle) * size
        const py = y + Math.sin(angle) * size
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
    }

    // Draw triangle
    const drawTriangle = (x: number, y: number, size: number, rotation: number) => {
      ctx.beginPath()
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3 + rotation
        const px = x + Math.cos(angle) * size
        const py = y + Math.sin(angle) * size
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
    }

    // Update and draw shapes
    const updateShapes = () => {
      const isDark = resolvedTheme === "dark"
      const time = Date.now() * 0.001

      shapesRef.current.forEach((shape) => {
        // Update position
        shape.x += shape.vx
        shape.y += shape.vy
        shape.rotation += shape.rotationSpeed
        shape.pulsePhase += 0.01

        // Wrap around screen
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size

        // Gentle pulsing effect
        const pulseOpacity = shape.opacity * (0.5 + 0.5 * Math.sin(shape.pulsePhase))

        // Draw shape
        ctx.save()
        ctx.globalAlpha = pulseOpacity

        if (isDark) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
        } else {
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
          ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
        }

        ctx.lineWidth = 1

        switch (shape.type) {
          case "circle":
            ctx.beginPath()
            ctx.arc(shape.x, shape.y, shape.size * 0.3, 0, Math.PI * 2)
            ctx.stroke()
            break
          case "hexagon":
            drawHexagon(shape.x, shape.y, shape.size * 0.3, shape.rotation)
            ctx.stroke()
            break
          case "triangle":
            drawTriangle(shape.x, shape.y, shape.size * 0.3, shape.rotation)
            ctx.stroke()
            break
        }

        ctx.restore()
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      canvas.style.backgroundColor = resolvedTheme === "dark" ? "#111" : "#f9f9f9"

      drawSubtleGrid()
      drawGradientWaves()
      updateShapes()

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    initShapes()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [resolvedTheme])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
}
