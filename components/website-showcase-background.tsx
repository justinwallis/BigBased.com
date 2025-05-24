"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  type: "browser" | "tag" | "css" | "bracket" | "node"
  content: string
  rotation: number
  rotationSpeed: number
}

interface Connection {
  x1: number
  y1: number
  x2: number
  y2: number
  opacity: number
  pulse: number
}

export default function WebsiteShowcaseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    // Particle arrays
    const particles: Particle[] = []
    const connections: Connection[] = []

    // Content arrays
    const htmlTags = ["<div>", "<section>", "<header>", "<nav>", "<main>", "<footer>", "<article>"]
    const cssProps = ["display:", "margin:", "color:", "width:", "height:", "flex:", "grid:"]
    const brackets = ["{", "}", "<", ">", "[", "]", "(", ")"]

    // Initialize particles
    const initParticles = () => {
      const particleCount = Math.min(35, Math.floor((canvas.width * canvas.height) / 15000))

      for (let i = 0; i < particleCount; i++) {
        const types: Particle["type"][] = ["browser", "tag", "css", "bracket", "node"]
        const type = types[Math.floor(Math.random() * types.length)]

        let content = ""
        switch (type) {
          case "browser":
            content = "□"
            break
          case "tag":
            content = htmlTags[Math.floor(Math.random() * htmlTags.length)]
            break
          case "css":
            content = cssProps[Math.floor(Math.random() * cssProps.length)]
            break
          case "bracket":
            content = brackets[Math.floor(Math.random() * brackets.length)]
            break
          case "node":
            content = "●"
            break
        }

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: type === "node" ? 4 + Math.random() * 6 : 12 + Math.random() * 8,
          opacity: 0.1 + Math.random() * 0.2,
          type,
          content,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
        })
      }

      // Initialize connections
      const connectionCount = Math.min(8, Math.floor(particleCount / 4))
      for (let i = 0; i < connectionCount; i++) {
        connections.push({
          x1: Math.random() * canvas.width,
          y1: Math.random() * canvas.height,
          x2: Math.random() * canvas.width,
          y2: Math.random() * canvas.height,
          opacity: 0.05 + Math.random() * 0.1,
          pulse: Math.random() * Math.PI * 2,
        })
      }
    }

    initParticles()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections first (behind particles)
      connections.forEach((connection) => {
        const pulseOpacity = connection.opacity * (0.5 + 0.5 * Math.sin(connection.pulse))

        ctx.strokeStyle = `rgba(59, 130, 246, ${pulseOpacity})`
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(connection.x1, connection.y1)
        ctx.lineTo(connection.x2, connection.y2)
        ctx.stroke()
        ctx.setLineDash([])

        // Update pulse
        connection.pulse += 0.05
      })

      // Draw particles
      particles.forEach((particle) => {
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)

        if (particle.type === "browser") {
          // Draw browser window
          ctx.strokeStyle = `rgba(59, 130, 246, ${particle.opacity})`
          ctx.lineWidth = 1
          ctx.strokeRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.7)
          // Browser bar
          ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity * 0.5})`
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.2)
        } else if (particle.type === "node") {
          // Draw node
          ctx.fillStyle = `rgba(34, 197, 94, ${particle.opacity})`
          ctx.beginPath()
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Draw text content
          ctx.fillStyle = `rgba(107, 114, 128, ${particle.opacity})`
          ctx.font = `${particle.size}px monospace`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(particle.content, 0, 0)
        }

        ctx.restore()

        // Update particle position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.rotation += particle.rotationSpeed

        // Wrap around edges
        if (particle.x < -50) particle.x = canvas.width + 50
        if (particle.x > canvas.width + 50) particle.x = -50
        if (particle.y < -50) particle.y = canvas.height + 50
        if (particle.y > canvas.height + 50) particle.y = -50
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
}
