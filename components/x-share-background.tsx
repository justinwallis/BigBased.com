"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  type: string
  opacity: number
  size: number
  rotation: number
  rotationSpeed: number
  life: number
  maxLife: number
  text?: string
  color: string
}

export default function XShareBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])

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

    const isDarkMode = theme === "dark"

    // Social media elements
    const tweetSnippets = [
      "Just discovered...",
      "This is amazing!",
      "Check this out",
      "Mind blown 🤯",
      "Game changer",
      "So based!",
      "Truth!",
      "Finally!",
      "This! 👆",
      "Exactly!",
    ]

    const socialIcons = ["❤️", "🔄", "💬", "📤", "🔥", "📈", "⭐", "👍", "🎯", "✨"]
    const hashtagSymbols = ["#BigBased", "#Truth", "#Based", "#Freedom", "#Tech"]
    const mentionSymbols = ["@user", "@based", "@truth", "@freedom"]
    const engagementNumbers = ["1.2K", "5.7K", "12K", "280", "140", "999+"]

    // Create particles
    const createParticle = (): Particle => {
      const types = ["tweet", "icon", "hashtag", "mention", "engagement", "trending"]
      const type = types[Math.floor(Math.random() * types.length)]

      let text = ""
      let color = isDarkMode ? "#60A5FA" : "#1D4ED8" // Default blue

      switch (type) {
        case "tweet":
          text = tweetSnippets[Math.floor(Math.random() * tweetSnippets.length)]
          color = isDarkMode ? "#9CA3AF" : "#6B7280"
          break
        case "icon":
          text = socialIcons[Math.floor(Math.random() * socialIcons.length)]
          if (text === "❤️") color = "#EF4444"
          else if (text === "🔄") color = "#10B981"
          else if (text === "🔥") color = "#F59E0B"
          else if (text === "📈") color = "#8B5CF6"
          break
        case "hashtag":
          text = hashtagSymbols[Math.floor(Math.random() * hashtagSymbols.length)]
          color = isDarkMode ? "#60A5FA" : "#1D4ED8"
          break
        case "mention":
          text = mentionSymbols[Math.floor(Math.random() * mentionSymbols.length)]
          color = isDarkMode ? "#34D399" : "#059669"
          break
        case "engagement":
          text = engagementNumbers[Math.floor(Math.random() * engagementNumbers.length)]
          color = isDarkMode ? "#F472B6" : "#DB2777"
          break
        case "trending":
          text = Math.random() > 0.5 ? "🔥 Trending" : "📈 Viral"
          color = "#F59E0B"
          break
      }

      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 50,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.8 - 0.2,
        type,
        opacity: Math.random() * 0.3 + 0.1,
        size: Math.random() * 8 + 12,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        life: 0,
        maxLife: Math.random() * 3000 + 2000,
        text,
        color,
      }
    }

    // Initialize particles
    const maxParticles = Math.min(30, Math.floor(canvas.width / 40))
    for (let i = 0; i < maxParticles; i++) {
      particlesRef.current.push(createParticle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.rotation += particle.rotationSpeed
        particle.life += 16

        // Update opacity based on life
        const lifeRatio = particle.life / particle.maxLife
        if (lifeRatio < 0.1) {
          particle.opacity = (lifeRatio / 0.1) * 0.4
        } else if (lifeRatio > 0.9) {
          particle.opacity = ((1 - lifeRatio) / 0.1) * 0.4
        }

        // Remove dead particles
        if (particle.life >= particle.maxLife || particle.y < -50) {
          particlesRef.current[index] = createParticle()
          return
        }

        // Draw particle
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)
        ctx.globalAlpha = particle.opacity

        if (particle.type === "tweet") {
          // Draw tweet bubble
          const padding = 8
          const textWidth = ctx.measureText(particle.text || "").width
          const bubbleWidth = textWidth + padding * 2
          const bubbleHeight = particle.size + padding

          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.roundRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, 8)
          ctx.fill()

          // Draw text
          ctx.fillStyle = isDarkMode ? "#FFFFFF" : "#FFFFFF"
          ctx.font = `${particle.size * 0.6}px Arial`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(particle.text || "", 0, 0)
        } else {
          // Draw other elements
          ctx.fillStyle = particle.color
          ctx.font = `${particle.size}px Arial`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(particle.text || "", 0, 0)
        }

        ctx.restore()
      })

      // Draw connection lines occasionally
      if (Math.random() < 0.1) {
        const particles = particlesRef.current.filter((p) => p.opacity > 0.2)
        if (particles.length >= 2) {
          const p1 = particles[Math.floor(Math.random() * particles.length)]
          const p2 = particles[Math.floor(Math.random() * particles.length)]

          if (p1 !== p2) {
            const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
            if (distance < 200) {
              ctx.strokeStyle = isDarkMode ? "rgba(96, 165, 250, 0.1)" : "rgba(29, 78, 216, 0.1)"
              ctx.lineWidth = 1
              ctx.setLineDash([5, 5])
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
              ctx.setLineDash([])
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [theme])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
}
