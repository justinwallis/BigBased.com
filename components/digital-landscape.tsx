"use client"

import { useEffect, useRef } from "react"

export default function DigitalLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match parent container
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Force a redraw after resize
      if (canvas.width > 0 && canvas.height > 0) {
        console.log("Canvas resized:", canvas.width, "x", canvas.height)
      }
    }

    // Initial resize
    setTimeout(resizeCanvas, 100)
    window.addEventListener("resize", resizeCanvas)

    // Animation state
    let animationId: number
    let time = 0

    // Cloud data
    const clouds = Array.from({ length: 12 }, (_, i) => ({
      x: i * 150 + Math.random() * 100,
      y: 30 + Math.random() * 80,
      size: 30 + Math.random() * 40,
      speed: 0.3 + Math.random() * 0.4,
      opacity: 0.2 + Math.random() * 0.3,
    }))

    // Grass blade data
    let grassBlades: Array<{ x: number; height: number; phase: number; speed: number }> = []

    const initGrass = () => {
      if (canvas.width > 0) {
        grassBlades = Array.from({ length: Math.floor(canvas.width / 8) }, (_, i) => ({
          x: i * 8 + Math.random() * 6,
          height: 15 + Math.random() * 25,
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.01,
        }))
      }
    }

    const animate = () => {
      if (canvas.width === 0 || canvas.height === 0) {
        animationId = requestAnimationFrame(animate)
        return
      }

      if (grassBlades.length === 0) {
        initGrass()
      }

      time += 0.016

      // Clear canvas with a visible background for testing
      ctx.fillStyle = "rgba(0, 20, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw hills (multiple layers for depth) - make them more visible
      const hillLayers = [
        { y: canvas.height * 0.6, opacity: 0.4, color: "#1a5f3f" },
        { y: canvas.height * 0.7, opacity: 0.3, color: "#2d7a4f" },
        { y: canvas.height * 0.8, opacity: 0.25, color: "#4a9d6f" },
      ]

      hillLayers.forEach((layer, index) => {
        ctx.fillStyle = layer.color
        ctx.globalAlpha = layer.opacity
        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        // Create hill shape with curves
        for (let x = 0; x <= canvas.width; x += 30) {
          const hillHeight = layer.y + Math.sin(x / 150 + index * 0.7 + time * 0.1) * 20
          if (x === 0) {
            ctx.lineTo(x, hillHeight)
          } else {
            ctx.lineTo(x, hillHeight)
          }
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.closePath()
        ctx.fill()
      })

      // Draw grass - make it more visible
      ctx.globalAlpha = 0.6
      ctx.strokeStyle = "#4ade80"
      ctx.lineWidth = 2

      grassBlades.forEach((blade) => {
        const sway = Math.sin(time * blade.speed + blade.phase) * 4
        const baseY = canvas.height * 0.85

        ctx.beginPath()
        ctx.moveTo(blade.x, canvas.height)
        ctx.quadraticCurveTo(blade.x + sway, baseY - blade.height / 2, blade.x + sway * 1.5, baseY - blade.height)
        ctx.stroke()
      })

      // Draw clouds - make them more visible
      clouds.forEach((cloud) => {
        cloud.x += cloud.speed
        if (cloud.x > canvas.width + cloud.size * 2) {
          cloud.x = -cloud.size * 2
        }

        ctx.globalAlpha = cloud.opacity
        ctx.fillStyle = "#ffffff"

        // Draw cloud as multiple circles
        const cloudParts = [
          { x: 0, y: 0, size: cloud.size },
          { x: cloud.size * 0.6, y: -cloud.size * 0.2, size: cloud.size * 0.8 },
          { x: cloud.size * 1.2, y: 0, size: cloud.size * 0.9 },
          { x: cloud.size * 0.3, y: cloud.size * 0.3, size: cloud.size * 0.6 },
        ]

        cloudParts.forEach((part) => {
          ctx.beginPath()
          ctx.arc(cloud.x + part.x, cloud.y + part.y, part.size, 0, Math.PI * 2)
          ctx.fill()
        })
      })

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    // Start animation after a short delay
    setTimeout(() => {
      animate()
    }, 200)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 5,
        display: "block",
        background: "transparent",
      }}
    />
  )
}
