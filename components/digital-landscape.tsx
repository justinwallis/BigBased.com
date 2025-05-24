"use client"

import { useEffect, useRef } from "react"

export default function DigitalLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation state
    let animationId: number
    let time = 0

    // Cloud data
    const clouds = Array.from({ length: 8 }, (_, i) => ({
      x: i * 200 + Math.random() * 100,
      y: 50 + Math.random() * 100,
      size: 40 + Math.random() * 60,
      speed: 0.2 + Math.random() * 0.3,
      opacity: 0.1 + Math.random() * 0.2,
    }))

    // Grass blade data
    const grassBlades = Array.from({ length: 150 }, (_, i) => ({
      x: i * (canvas.width / 150) + Math.random() * 10,
      height: 20 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.01,
    }))

    const animate = () => {
      time += 0.016 // ~60fps

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw hills (multiple layers for depth)
      const hillLayers = [
        { y: canvas.height * 0.7, opacity: 0.15, color: "#1a5f3f" },
        { y: canvas.height * 0.75, opacity: 0.12, color: "#2d7a4f" },
        { y: canvas.height * 0.8, opacity: 0.1, color: "#4a9d6f" },
      ]

      hillLayers.forEach((layer, index) => {
        ctx.fillStyle = layer.color
        ctx.globalAlpha = layer.opacity
        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        // Create hill shape with curves
        for (let x = 0; x <= canvas.width; x += 50) {
          const hillHeight = layer.y + Math.sin(x / 200 + index * 0.5) * 30
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

      // Draw grass
      ctx.globalAlpha = 0.3
      ctx.strokeStyle = "#4ade80"
      ctx.lineWidth = 1

      grassBlades.forEach((blade) => {
        const sway = Math.sin(time * blade.speed + blade.phase) * 3
        const baseY = canvas.height * 0.85

        ctx.beginPath()
        ctx.moveTo(blade.x, canvas.height)
        ctx.quadraticCurveTo(blade.x + sway, baseY - blade.height / 2, blade.x + sway * 2, baseY - blade.height)
        ctx.stroke()
      })

      // Draw clouds
      clouds.forEach((cloud) => {
        cloud.x += cloud.speed
        if (cloud.x > canvas.width + cloud.size) {
          cloud.x = -cloud.size
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

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }} />
}
