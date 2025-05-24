"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  char: string
  opacity: number
  size: number
  type: "binary" | "symbol" | "dot"
  life: number
  maxLife: number
}

export function DigitalLibraryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const particlesRef = useRef<Particle[]>([])
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
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Binary characters and knowledge symbols
    const binaryChars = ["0", "1"]
    const knowledgeSymbols = ["📚", "📖", "📝", "💡", "🔍", "⚡", "🧠", "🎓"]
    const techSymbols = ["◆", "◇", "▲", "▼", "●", "○", "■", "□"]

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 8000)

      for (let i = 0; i < particleCount; i++) {
        const type = Math.random() < 0.7 ? "binary" : Math.random() < 0.8 ? "symbol" : "dot"
        let char = ""

        if (type === "binary") {
          char = binaryChars[Math.floor(Math.random() * binaryChars.length)]
        } else if (type === "symbol") {
          char =
            Math.random() < 0.6
              ? techSymbols[Math.floor(Math.random() * techSymbols.length)]
              : knowledgeSymbols[Math.floor(Math.random() * knowledgeSymbols.length)]
        }

        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          char,
          opacity: Math.random() * 0.6 + 0.1,
          size: type === "binary" ? 12 + Math.random() * 4 : type === "symbol" ? 16 + Math.random() * 8 : 2,
          type,
          life: 0,
          maxLife: 300 + Math.random() * 200,
        })
      }
    }

    // Draw grid pattern
    const drawGrid = () => {
      const isDark = resolvedTheme === "dark"
      ctx.strokeStyle = isDark ? "rgba(0, 255, 0, 0.03)" : "rgba(0, 0, 0, 0.03)"
      ctx.lineWidth = 1

      const gridSize = 50

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    // Draw flowing data streams
    const drawDataStreams = () => {
      const isDark = resolvedTheme === "dark"
      const time = Date.now() * 0.001

      ctx.strokeStyle = isDark ? "rgba(0, 255, 0, 0.1)" : "rgba(0, 100, 200, 0.1)"
      ctx.lineWidth = 2

      // Horizontal streams
      for (let i = 0; i < 3; i++) {
        const y = (canvas.height / 4) * (i + 1)
        const offset = (time * 50 + i * 100) % (canvas.width + 200)

        ctx.beginPath()
        ctx.moveTo(offset - 200, y)
        ctx.lineTo(offset, y)
        ctx.stroke()
      }

      // Vertical streams
      for (let i = 0; i < 2; i++) {
        const x = (canvas.width / 3) * (i + 1)
        const offset = (time * 30 + i * 150) % (canvas.height + 200)

        ctx.beginPath()
        ctx.moveTo(x, offset - 200)
        ctx.lineTo(x, offset)
        ctx.stroke()
      }
    }

    // Update and draw particles
    const updateParticles = () => {
      const isDark = resolvedTheme === "dark"

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        // Wrap around screen
        if (particle.x < -20) particle.x = canvas.width + 20
        if (particle.x > canvas.width + 20) particle.x = -20
        if (particle.y < -20) particle.y = canvas.height + 20
        if (particle.y > canvas.height + 20) particle.y = -20

        // Update opacity based on life
        const lifeRatio = particle.life / particle.maxLife
        particle.opacity = Math.sin(lifeRatio * Math.PI) * 0.6 + 0.1

        // Reset particle if life exceeded
        if (particle.life > particle.maxLife) {
          particle.life = 0
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
        }

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity

        if (particle.type === "dot") {
          ctx.fillStyle = isDark ? "#00ff00" : "#0066cc"
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          if (particle.type === "binary") {
            ctx.fillStyle = isDark ? "#00ff00" : "#333333"
          } else {
            ctx.fillStyle = isDark ? "#00ccff" : "#0066cc"
          }

          ctx.font = `${particle.size}px monospace`
          ctx.textAlign = "center"
          ctx.fillText(particle.char, particle.x, particle.y)
        }

        ctx.restore()
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawGrid()
      drawDataStreams()
      updateParticles()

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    initParticles()
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
