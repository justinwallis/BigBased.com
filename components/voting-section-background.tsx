"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface VotingParticle {
  x: number
  y: number
  vx: number
  vy: number
  type: "thumbsUp" | "thumbsDown" | "checkmark" | "x" | "chart" | "signal" | "scale" | "vote"
  opacity: number
  size: number
  rotation: number
  rotationSpeed: number
  life: number
  maxLife: number
}

interface DataVisualization {
  x: number
  y: number
  type: "barChart" | "pieChart" | "lineGraph"
  opacity: number
  scale: number
  animationPhase: number
}

interface SignalWave {
  x: number
  y: number
  radius: number
  opacity: number
  speed: number
}

export default function VotingSectionBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<VotingParticle[]>([])
  const dataVizsRef = useRef<DataVisualization[]>([])
  const signalWavesRef = useRef<SignalWave[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      canvas.style.width = rect.width + "px"
      canvas.style.height = rect.height + "px"
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles
    const initParticles = () => {
      const particleCount = Math.min(25, Math.floor((canvas.width * canvas.height) / 50000))
      particlesRef.current = []

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(createParticle())
      }
    }

    // Initialize data visualizations
    const initDataVizs = () => {
      const vizCount = Math.min(8, Math.floor((canvas.width * canvas.height) / 100000))
      dataVizsRef.current = []

      for (let i = 0; i < vizCount; i++) {
        dataVizsRef.current.push(createDataViz())
      }
    }

    // Initialize signal waves
    const initSignalWaves = () => {
      signalWavesRef.current = []
      for (let i = 0; i < 3; i++) {
        signalWavesRef.current.push(createSignalWave())
      }
    }

    const createParticle = (): VotingParticle => {
      const types: VotingParticle["type"][] = [
        "thumbsUp",
        "thumbsDown",
        "checkmark",
        "x",
        "chart",
        "signal",
        "scale",
        "vote",
      ]
      return {
        x: Math.random() * (canvas.width / window.devicePixelRatio),
        y: Math.random() * (canvas.height / window.devicePixelRatio),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        type: types[Math.floor(Math.random() * types.length)],
        opacity: Math.random() * 0.15 + 0.05,
        size: Math.random() * 15 + 8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        life: 0,
        maxLife: Math.random() * 1000 + 2000,
      }
    }

    const createDataViz = (): DataVisualization => {
      const types: DataVisualization["type"][] = ["barChart", "pieChart", "lineGraph"]
      return {
        x: Math.random() * (canvas.width / window.devicePixelRatio),
        y: Math.random() * (canvas.height / window.devicePixelRatio),
        type: types[Math.floor(Math.random() * types.length)],
        opacity: Math.random() * 0.08 + 0.02,
        scale: Math.random() * 0.5 + 0.3,
        animationPhase: Math.random() * Math.PI * 2,
      }
    }

    const createSignalWave = (): SignalWave => ({
      x: Math.random() * (canvas.width / window.devicePixelRatio),
      y: Math.random() * (canvas.height / window.devicePixelRatio),
      radius: 0,
      opacity: 0.1,
      speed: Math.random() * 0.5 + 0.3,
    })

    // Drawing functions
    const drawVotingSymbol = (ctx: CanvasRenderingContext2D, particle: VotingParticle) => {
      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.rotate(particle.rotation)
      ctx.globalAlpha = particle.opacity

      const isDark = theme === "dark"
      ctx.strokeStyle = isDark ? "#10B981" : "#3B82F6"
      ctx.fillStyle = isDark ? "#10B981" : "#3B82F6"
      ctx.lineWidth = 2

      switch (particle.type) {
        case "thumbsUp":
          // Thumbs up symbol
          ctx.beginPath()
          ctx.arc(0, 0, particle.size * 0.3, 0, Math.PI * 2)
          ctx.moveTo(-particle.size * 0.2, 0)
          ctx.lineTo(-particle.size * 0.2, particle.size * 0.4)
          ctx.lineTo(particle.size * 0.2, particle.size * 0.4)
          ctx.lineTo(particle.size * 0.2, particle.size * 0.1)
          ctx.stroke()
          break

        case "thumbsDown":
          // Thumbs down symbol
          ctx.strokeStyle = isDark ? "#EF4444" : "#DC2626"
          ctx.beginPath()
          ctx.arc(0, 0, particle.size * 0.3, 0, Math.PI * 2)
          ctx.moveTo(-particle.size * 0.2, 0)
          ctx.lineTo(-particle.size * 0.2, -particle.size * 0.4)
          ctx.lineTo(particle.size * 0.2, -particle.size * 0.4)
          ctx.lineTo(particle.size * 0.2, -particle.size * 0.1)
          ctx.stroke()
          break

        case "checkmark":
          // Checkmark
          ctx.beginPath()
          ctx.moveTo(-particle.size * 0.3, 0)
          ctx.lineTo(-particle.size * 0.1, particle.size * 0.2)
          ctx.lineTo(particle.size * 0.3, -particle.size * 0.2)
          ctx.stroke()
          break

        case "x":
          // X mark
          ctx.strokeStyle = isDark ? "#EF4444" : "#DC2626"
          ctx.beginPath()
          ctx.moveTo(-particle.size * 0.3, -particle.size * 0.3)
          ctx.lineTo(particle.size * 0.3, particle.size * 0.3)
          ctx.moveTo(particle.size * 0.3, -particle.size * 0.3)
          ctx.lineTo(-particle.size * 0.3, particle.size * 0.3)
          ctx.stroke()
          break

        case "chart":
          // Bar chart
          ctx.beginPath()
          for (let i = 0; i < 3; i++) {
            const height = (Math.sin(particle.life * 0.01 + i) + 1) * particle.size * 0.2 + particle.size * 0.1
            ctx.rect(-particle.size * 0.3 + i * particle.size * 0.2, -height, particle.size * 0.15, height)
          }
          ctx.stroke()
          break

        case "signal":
          // Signal waves
          ctx.beginPath()
          for (let i = 1; i <= 3; i++) {
            ctx.arc(0, 0, particle.size * 0.1 * i, 0, Math.PI, true)
          }
          ctx.stroke()
          break

        case "scale":
          // Scale/balance
          ctx.beginPath()
          ctx.moveTo(-particle.size * 0.3, 0)
          ctx.lineTo(particle.size * 0.3, 0)
          ctx.moveTo(-particle.size * 0.2, 0)
          ctx.lineTo(-particle.size * 0.2, -particle.size * 0.2)
          ctx.moveTo(particle.size * 0.2, 0)
          ctx.lineTo(particle.size * 0.2, -particle.size * 0.2)
          ctx.moveTo(0, 0)
          ctx.lineTo(0, particle.size * 0.3)
          ctx.stroke()
          break

        case "vote":
          // Ballot box
          ctx.beginPath()
          ctx.rect(-particle.size * 0.3, -particle.size * 0.2, particle.size * 0.6, particle.size * 0.4)
          ctx.moveTo(-particle.size * 0.1, -particle.size * 0.3)
          ctx.lineTo(particle.size * 0.1, -particle.size * 0.3)
          ctx.lineTo(0, -particle.size * 0.1)
          ctx.stroke()
          break
      }

      ctx.restore()
    }

    const drawDataVisualization = (ctx: CanvasRenderingContext2D, viz: DataVisualization) => {
      ctx.save()
      ctx.translate(viz.x, viz.y)
      ctx.scale(viz.scale, viz.scale)
      ctx.globalAlpha = viz.opacity

      const isDark = theme === "dark"
      ctx.strokeStyle = isDark ? "#10B981" : "#3B82F6"
      ctx.fillStyle = isDark ? "#10B981" : "#3B82F6"
      ctx.lineWidth = 1

      switch (viz.type) {
        case "barChart":
          // Animated bar chart
          for (let i = 0; i < 4; i++) {
            const height = (Math.sin(viz.animationPhase + i * 0.5) + 1) * 20 + 10
            ctx.fillRect(i * 15 - 30, -height, 10, height)
          }
          break

        case "pieChart":
          // Animated pie chart
          ctx.beginPath()
          ctx.arc(0, 0, 25, 0, Math.PI * 2)
          ctx.stroke()

          const segments = 4
          for (let i = 0; i < segments; i++) {
            const startAngle = (i / segments) * Math.PI * 2
            const endAngle = ((i + 1) / segments) * Math.PI * 2
            const animatedEnd = startAngle + ((endAngle - startAngle) * (Math.sin(viz.animationPhase + i) + 1)) / 2

            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.arc(0, 0, 25, startAngle, animatedEnd)
            ctx.closePath()
            ctx.globalAlpha = viz.opacity * 0.3
            ctx.fill()
            ctx.globalAlpha = viz.opacity
          }
          break

        case "lineGraph":
          // Animated line graph
          ctx.beginPath()
          ctx.moveTo(-30, 0)
          for (let i = 0; i <= 60; i += 5) {
            const y = Math.sin((i + viz.animationPhase * 10) * 0.1) * 15
            ctx.lineTo(i - 30, y)
          }
          ctx.stroke()
          break
      }

      ctx.restore()
    }

    const drawSignalWave = (ctx: CanvasRenderingContext2D, wave: SignalWave) => {
      ctx.save()
      ctx.globalAlpha = wave.opacity * (1 - wave.radius / 100)

      const isDark = theme === "dark"
      ctx.strokeStyle = isDark ? "#10B981" : "#3B82F6"
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
      ctx.stroke()

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.rotation += particle.rotationSpeed
        particle.life++

        // Wrap around screen
        if (particle.x < -50) particle.x = canvas.width / window.devicePixelRatio + 50
        if (particle.x > canvas.width / window.devicePixelRatio + 50) particle.x = -50
        if (particle.y < -50) particle.y = canvas.height / window.devicePixelRatio + 50
        if (particle.y > canvas.height / window.devicePixelRatio + 50) particle.y = -50

        // Reset particle if it's lived too long
        if (particle.life > particle.maxLife) {
          particlesRef.current[index] = createParticle()
        }

        drawVotingSymbol(ctx, particle)
      })

      // Update and draw data visualizations
      dataVizsRef.current.forEach((viz, index) => {
        viz.animationPhase += 0.02

        if (viz.animationPhase > Math.PI * 4) {
          dataVizsRef.current[index] = createDataViz()
        }

        drawDataVisualization(ctx, viz)
      })

      // Update and draw signal waves
      signalWavesRef.current.forEach((wave, index) => {
        wave.radius += wave.speed

        if (wave.radius > 100) {
          signalWavesRef.current[index] = createSignalWave()
        }

        drawSignalWave(ctx, wave)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    initParticles()
    initDataVizs()
    initSignalWaves()
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
