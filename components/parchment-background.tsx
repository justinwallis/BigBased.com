"use client"
import { useEffect, useRef } from "react"

export default function ParchmentBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Parchment colors
    const parchmentColors = ["#f4f1e8", "#f0ead6", "#ede4d1", "#e8dcc0", "#e3d5b7"]

    // Create gradient for aged paper effect
    const createParchmentGradient = () => {
      const gradient = ctx.createRadialGradient(
        canvas.offsetWidth / 2,
        canvas.offsetHeight / 2,
        0,
        canvas.offsetWidth / 2,
        canvas.offsetHeight / 2,
        Math.max(canvas.offsetWidth, canvas.offsetHeight) / 2,
      )
      gradient.addColorStop(0, "#f4f1e8")
      gradient.addColorStop(0.3, "#f0ead6")
      gradient.addColorStop(0.6, "#ede4d1")
      gradient.addColorStop(0.8, "#e8dcc0")
      gradient.addColorStop(1, "#e3d5b7")
      return gradient
    }

    // Aging spots and stains
    const ageSpots: Array<{ x: number; y: number; size: number; opacity: number; color: string }> = []

    // Generate random age spots
    for (let i = 0; i < 15; i++) {
      ageSpots.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 30 + 10,
        opacity: Math.random() * 0.1 + 0.02,
        color: `rgba(139, 115, 85, ${Math.random() * 0.1 + 0.02})`,
      })
    }

    // Paper fibers/texture lines
    const paperFibers: Array<{ x1: number; y1: number; x2: number; y2: number; opacity: number }> = []

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2
      const length = Math.random() * 20 + 5
      const x = Math.random() * canvas.offsetWidth
      const y = Math.random() * canvas.offsetHeight

      paperFibers.push({
        x1: x,
        y1: y,
        x2: x + Math.cos(angle) * length,
        y2: y + Math.sin(angle) * length,
        opacity: Math.random() * 0.05 + 0.01,
      })
    }

    let animationFrame: number
    let time = 0

    const animate = () => {
      time += 0.01

      // Clear canvas
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Draw base parchment
      ctx.fillStyle = createParchmentGradient()
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Add subtle texture with noise
      const imageData = ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 10
        data[i] = Math.max(0, Math.min(255, data[i] + noise)) // Red
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)) // Green
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)) // Blue
      }

      ctx.putImageData(imageData, 0, 0)

      // Draw age spots with subtle movement
      ageSpots.forEach((spot, index) => {
        const wobble = Math.sin(time * 2 + index) * 0.5
        ctx.globalAlpha = spot.opacity + wobble * 0.01
        ctx.fillStyle = spot.color
        ctx.beginPath()
        ctx.arc(spot.x + wobble, spot.y + wobble * 0.5, spot.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw paper fibers
      ctx.globalAlpha = 0.03
      ctx.strokeStyle = "#8b7355"
      ctx.lineWidth = 0.5
      paperFibers.forEach((fiber, index) => {
        const sway = Math.sin(time * 1.5 + index * 0.1) * 0.3
        ctx.beginPath()
        ctx.moveTo(fiber.x1 + sway, fiber.y1)
        ctx.lineTo(fiber.x2 + sway, fiber.y2)
        ctx.stroke()
      })

      // Add subtle page curl effect in corners
      ctx.globalAlpha = 0.1
      const curlIntensity = Math.sin(time * 0.5) * 0.02 + 0.03

      // Top-right corner curl
      const gradient1 = ctx.createLinearGradient(canvas.offsetWidth - 100, 0, canvas.offsetWidth, 100)
      gradient1.addColorStop(0, "transparent")
      gradient1.addColorStop(1, `rgba(139, 115, 85, ${curlIntensity})`)
      ctx.fillStyle = gradient1
      ctx.fillRect(canvas.offsetWidth - 100, 0, 100, 100)

      // Bottom-left corner curl
      const gradient2 = ctx.createLinearGradient(0, canvas.offsetHeight - 100, 100, canvas.offsetHeight)
      gradient2.addColorStop(0, "transparent")
      gradient2.addColorStop(1, `rgba(139, 115, 85, ${curlIntensity})`)
      ctx.fillStyle = gradient2
      ctx.fillRect(0, canvas.offsetHeight - 100, 100, 100)

      // Reset alpha
      ctx.globalAlpha = 1

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        mixBlendMode: "multiply",
        opacity: 0.7,
      }}
    />
  )
}
