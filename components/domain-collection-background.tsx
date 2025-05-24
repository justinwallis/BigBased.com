"use client"

import { useEffect, useRef } from "react"
import { generateAllDomains } from "@/utils/domain-generator"

interface DomainStream {
  id: number
  x: number
  y: number
  speed: number
  direction: number // 1 for right, -1 for left
  domains: string[]
  currentDomain: string
  morphProgress: number
  targetDomain: string
  opacity: number
  size: number
}

interface NetworkNode {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  connections: number[]
  pulse: number
  growth: number
}

interface Connection {
  from: number
  to: number
  progress: number
  opacity: number
  pulse: number
}

export default function DomainCollectionBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const streamsRef = useRef<DomainStream[]>([])
  const nodesRef = useRef<NetworkNode[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const allDomainsRef = useRef<string[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get all domains
    const domains = generateAllDomains()
    allDomainsRef.current = domains.map((d) => d.name)

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      canvas.style.width = rect.width + "px"
      canvas.style.height = rect.height + "px"
    }

    const initializeStreams = () => {
      const streamCount = Math.min(8, Math.max(4, Math.floor(canvas.width / 200)))
      streamsRef.current = []

      for (let i = 0; i < streamCount; i++) {
        const domains = [...allDomainsRef.current].sort(() => Math.random() - 0.5).slice(0, 20)
        streamsRef.current.push({
          id: i,
          x: Math.random() * canvas.width,
          y: (i + 1) * (canvas.height / (streamCount + 1)),
          speed: 0.5 + Math.random() * 1.5,
          direction: Math.random() > 0.5 ? 1 : -1,
          domains,
          currentDomain: domains[0],
          morphProgress: 0,
          targetDomain: domains[1],
          opacity: 0.3 + Math.random() * 0.4,
          size: 12 + Math.random() * 6,
        })
      }
    }

    const initializeNetwork = () => {
      const nodeCount = Math.min(15, Math.max(8, Math.floor(canvas.width / 100)))
      nodesRef.current = []
      connectionsRef.current = []

      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          targetX: Math.random() * canvas.width,
          targetY: Math.random() * canvas.height,
          connections: [],
          pulse: Math.random() * Math.PI * 2,
          growth: 0,
        })
      }

      // Create some initial connections
      for (let i = 0; i < nodeCount; i++) {
        const connectionsCount = Math.floor(Math.random() * 3) + 1
        for (let j = 0; j < connectionsCount; j++) {
          const targetId = Math.floor(Math.random() * nodeCount)
          if (targetId !== i && !nodesRef.current[i].connections.includes(targetId)) {
            nodesRef.current[i].connections.push(targetId)
            connectionsRef.current.push({
              from: i,
              to: targetId,
              progress: 0,
              opacity: 0,
              pulse: 0,
            })
          }
        }
      }
    }

    const morphText = (current: string, target: string, progress: number): string => {
      if (progress >= 1) return target

      const currentChars = current.split("")
      const targetChars = target.split("")
      const maxLength = Math.max(currentChars.length, targetChars.length)

      let result = ""
      for (let i = 0; i < maxLength; i++) {
        const currentChar = currentChars[i] || ""
        const targetChar = targetChars[i] || ""

        if (Math.random() < progress) {
          result += targetChar
        } else {
          result += currentChar
        }
      }

      return result
    }

    const animate = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get theme
      const isDark = document.documentElement.classList.contains("dark")

      // Update and draw domain streams
      streamsRef.current.forEach((stream) => {
        // Update position
        stream.x += stream.speed * stream.direction

        // Wrap around screen
        if (stream.direction > 0 && stream.x > canvas.width + 200) {
          stream.x = -200
        } else if (stream.direction < 0 && stream.x < -200) {
          stream.x = canvas.width + 200
        }

        // Update morphing
        stream.morphProgress += 0.005
        if (stream.morphProgress >= 1) {
          stream.morphProgress = 0
          stream.currentDomain = stream.targetDomain
          const nextIndex = (stream.domains.indexOf(stream.currentDomain) + 1) % stream.domains.length
          stream.targetDomain = stream.domains[nextIndex]
        }

        // Draw domain text
        const displayText = morphText(stream.currentDomain, stream.targetDomain, stream.morphProgress)

        ctx.save()
        ctx.font = `${stream.size}px monospace`
        ctx.fillStyle = isDark ? `rgba(156, 163, 175, ${stream.opacity})` : `rgba(75, 85, 99, ${stream.opacity})`
        ctx.textAlign = "center"

        // Add slight wave motion
        const waveY = stream.y + Math.sin(stream.x * 0.01) * 10
        ctx.fillText(displayText, stream.x, waveY)
        ctx.restore()
      })

      // Update and draw network nodes
      nodesRef.current.forEach((node) => {
        // Move towards target
        node.x += (node.targetX - node.x) * 0.01
        node.y += (node.targetY - node.y) * 0.01

        // Update target occasionally
        if (Math.random() < 0.001) {
          node.targetX = Math.random() * canvas.width
          node.targetY = Math.random() * canvas.height
        }

        // Update pulse
        node.pulse += 0.05
        node.growth = Math.min(1, node.growth + 0.01)

        // Draw node
        ctx.save()
        const pulseSize = 2 + Math.sin(node.pulse) * 1
        ctx.fillStyle = isDark ? `rgba(34, 197, 94, ${0.3 * node.growth})` : `rgba(59, 130, 246, ${0.3 * node.growth})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Update and draw connections
      connectionsRef.current.forEach((connection) => {
        const fromNode = nodesRef.current[connection.from]
        const toNode = nodesRef.current[connection.to]

        if (!fromNode || !toNode) return

        // Update connection growth
        connection.progress = Math.min(1, connection.progress + 0.005)
        connection.opacity = Math.min(0.2, connection.opacity + 0.002)
        connection.pulse += 0.1

        // Calculate connection path
        const dx = toNode.x - fromNode.x
        const dy = toNode.y - fromNode.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 0 && connection.progress > 0) {
          const currentX = fromNode.x + dx * connection.progress
          const currentY = fromNode.y + dy * connection.progress

          // Draw connection line
          ctx.save()
          ctx.strokeStyle = isDark
            ? `rgba(34, 197, 94, ${connection.opacity})`
            : `rgba(59, 130, 246, ${connection.opacity})`
          ctx.lineWidth = 1
          ctx.setLineDash([2, 4])
          ctx.lineDashOffset = -connection.pulse
          ctx.beginPath()
          ctx.moveTo(fromNode.x, fromNode.y)
          ctx.lineTo(currentX, currentY)
          ctx.stroke()
          ctx.restore()

          // Draw pulse dot
          if (connection.progress > 0.5) {
            ctx.save()
            ctx.fillStyle = isDark
              ? `rgba(34, 197, 94, ${Math.sin(connection.pulse) * 0.5 + 0.5})`
              : `rgba(59, 130, 246, ${Math.sin(connection.pulse) * 0.5 + 0.5})`
            ctx.beginPath()
            ctx.arc(currentX, currentY, 1.5, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          }
        }
      })

      // Occasionally add new connections
      if (Math.random() < 0.001 && connectionsRef.current.length < 20) {
        const fromId = Math.floor(Math.random() * nodesRef.current.length)
        const toId = Math.floor(Math.random() * nodesRef.current.length)

        if (fromId !== toId) {
          const existingConnection = connectionsRef.current.find(
            (c) => (c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId),
          )

          if (!existingConnection) {
            connectionsRef.current.push({
              from: fromId,
              to: toId,
              progress: 0,
              opacity: 0,
              pulse: 0,
            })
          }
        }
      }

      // Remove old connections occasionally
      if (Math.random() < 0.0005 && connectionsRef.current.length > 10) {
        connectionsRef.current.splice(0, 1)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initializeStreams()
    initializeNetwork()
    animate()

    const handleResize = () => {
      resizeCanvas()
      initializeStreams()
      initializeNetwork()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
}
