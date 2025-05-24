"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Neuron {
  x: number
  y: number
  connections: number[]
  charge: number
  maxCharge: number
  firingThreshold: number
  lastFired: number
  size: number
  type: "input" | "processing" | "wisdom"
}

interface Synapse {
  from: number
  to: number
  strength: number
  activity: number
  pulsePosition: number
  isActive: boolean
}

interface ThoughtCrystal {
  x: number
  y: number
  size: number
  growth: number
  rotation: number
  rotationSpeed: number
  facets: number
  opacity: number
  wisdom: string
  crystallizing: boolean
}

interface BrainWave {
  x: number
  y: number
  amplitude: number
  frequency: number
  phase: number
  wavelength: number
  opacity: number
  type: "alpha" | "beta" | "gamma" | "theta"
}

interface KnowledgeParticle {
  x: number
  y: number
  vx: number
  vy: number
  concept: string
  magnetism: number
  clustered: boolean
  clusterCenter?: { x: number; y: number }
  opacity: number
  size: number
}

export default function BasedTestBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const neuronsRef = useRef<Neuron[]>([])
  const synapsesRef = useRef<Synapse[]>([])
  const crystalsRef = useRef<ThoughtCrystal[]>([])
  const brainWavesRef = useRef<BrainWave[]>([])
  const particlesRef = useRef<KnowledgeParticle[]>([])
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

    // Initialize neural network
    const initNeuralNetwork = () => {
      const neuronCount = Math.min(20, Math.max(12, Math.floor(canvas.width / 80)))
      neuronsRef.current = []
      synapsesRef.current = []

      // Create neurons
      for (let i = 0; i < neuronCount; i++) {
        const types: Neuron["type"][] = ["input", "processing", "wisdom"]
        neuronsRef.current.push({
          x: Math.random() * (canvas.width / window.devicePixelRatio),
          y: Math.random() * (canvas.height / window.devicePixelRatio),
          connections: [],
          charge: Math.random() * 50,
          maxCharge: 100,
          firingThreshold: 80 + Math.random() * 20,
          lastFired: 0,
          size: Math.random() * 8 + 6,
          type: types[Math.floor(Math.random() * types.length)],
        })
      }

      // Create synapses
      neuronsRef.current.forEach((neuron, i) => {
        const connectionCount = Math.floor(Math.random() * 4) + 2
        for (let j = 0; j < connectionCount; j++) {
          const targetIndex = Math.floor(Math.random() * neuronsRef.current.length)
          if (targetIndex !== i && !neuron.connections.includes(targetIndex)) {
            neuron.connections.push(targetIndex)
            synapsesRef.current.push({
              from: i,
              to: targetIndex,
              strength: Math.random() * 0.8 + 0.2,
              activity: 0,
              pulsePosition: 0,
              isActive: false,
            })
          }
        }
      })
    }

    // Initialize thought crystals
    const initThoughtCrystals = () => {
      crystalsRef.current = []
      const wisdomConcepts = [
        "TRUTH",
        "WISDOM",
        "FREEDOM",
        "SOVEREIGNTY",
        "FAITH",
        "KNOWLEDGE",
        "INSIGHT",
        "CLARITY",
        "UNDERSTANDING",
        "ENLIGHTENMENT",
      ]

      for (let i = 0; i < 6; i++) {
        crystalsRef.current.push({
          x: Math.random() * (canvas.width / window.devicePixelRatio),
          y: Math.random() * (canvas.height / window.devicePixelRatio),
          size: Math.random() * 20 + 15,
          growth: 0,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          facets: Math.floor(Math.random() * 3) + 6,
          opacity: Math.random() * 0.3 + 0.1,
          wisdom: wisdomConcepts[Math.floor(Math.random() * wisdomConcepts.length)],
          crystallizing: false,
        })
      }
    }

    // Initialize brain waves
    const initBrainWaves = () => {
      brainWavesRef.current = []
      const waveTypes: BrainWave["type"][] = ["alpha", "beta", "gamma", "theta"]

      for (let i = 0; i < 4; i++) {
        brainWavesRef.current.push({
          x: 0,
          y: (i + 1) * (canvas.height / window.devicePixelRatio / 5),
          amplitude: Math.random() * 20 + 10,
          frequency: Math.random() * 0.05 + 0.02,
          phase: Math.random() * Math.PI * 2,
          wavelength: Math.random() * 100 + 50,
          opacity: Math.random() * 0.2 + 0.1,
          type: waveTypes[i],
        })
      }
    }

    // Initialize knowledge particles
    const initKnowledgeParticles = () => {
      particlesRef.current = []
      const concepts = [
        "Logic",
        "Reason",
        "Ethics",
        "Values",
        "Principles",
        "Beliefs",
        "Ideas",
        "Concepts",
        "Thoughts",
        "Insights",
      ]

      const particleCount = Math.min(15, Math.floor(canvas.width / 100))
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * (canvas.width / window.devicePixelRatio),
          y: Math.random() * (canvas.height / window.devicePixelRatio),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          concept: concepts[Math.floor(Math.random() * concepts.length)],
          magnetism: Math.random() * 50 + 25,
          clustered: false,
          opacity: Math.random() * 0.4 + 0.2,
          size: Math.random() * 6 + 8,
        })
      }
    }

    // Drawing functions
    const drawNeuron = (ctx: CanvasRenderingContext2D, neuron: Neuron, index: number) => {
      ctx.save()
      ctx.translate(neuron.x, neuron.y)

      const isDark = theme === "dark"
      const chargeRatio = neuron.charge / neuron.maxCharge

      // Neuron body
      let color = isDark ? "#6B7280" : "#9CA3AF"
      if (neuron.type === "wisdom") color = isDark ? "#F59E0B" : "#D97706"
      else if (neuron.type === "processing") color = isDark ? "#8B5CF6" : "#7C3AED"
      else if (chargeRatio > 0.8) color = isDark ? "#EF4444" : "#DC2626"

      ctx.fillStyle = color
      ctx.globalAlpha = 0.3 + chargeRatio * 0.7

      ctx.beginPath()
      ctx.arc(0, 0, neuron.size, 0, Math.PI * 2)
      ctx.fill()

      // Electrical activity
      if (chargeRatio > 0.6) {
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.globalAlpha = chargeRatio
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          const length = neuron.size + Math.random() * 10
          ctx.beginPath()
          ctx.moveTo(Math.cos(angle) * neuron.size, Math.sin(angle) * neuron.size)
          ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length)
          ctx.stroke()
        }
      }

      ctx.restore()
    }

    const drawSynapse = (ctx: CanvasRenderingContext2D, synapse: Synapse) => {
      const fromNeuron = neuronsRef.current[synapse.from]
      const toNeuron = neuronsRef.current[synapse.to]

      if (!fromNeuron || !toNeuron) return

      ctx.save()
      const isDark = theme === "dark"

      // Connection line
      ctx.strokeStyle = isDark ? "rgba(156, 163, 175, 0.3)" : "rgba(107, 114, 128, 0.3)"
      ctx.lineWidth = synapse.strength * 2
      ctx.beginPath()
      ctx.moveTo(fromNeuron.x, fromNeuron.y)
      ctx.lineTo(toNeuron.x, toNeuron.y)
      ctx.stroke()

      // Signal pulse
      if (synapse.isActive) {
        const dx = toNeuron.x - fromNeuron.x
        const dy = toNeuron.y - fromNeuron.y
        const pulseX = fromNeuron.x + dx * synapse.pulsePosition
        const pulseY = fromNeuron.y + dy * synapse.pulsePosition

        ctx.fillStyle = isDark ? "#10B981" : "#059669"
        ctx.globalAlpha = 1 - synapse.pulsePosition
        ctx.beginPath()
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    const drawThoughtCrystal = (ctx: CanvasRenderingContext2D, crystal: ThoughtCrystal) => {
      ctx.save()
      ctx.translate(crystal.x, crystal.y)
      ctx.rotate(crystal.rotation)
      ctx.globalAlpha = crystal.opacity

      const isDark = theme === "dark"
      ctx.strokeStyle = isDark ? "#8B5CF6" : "#7C3AED"
      ctx.fillStyle = isDark ? "rgba(139, 92, 246, 0.1)" : "rgba(124, 58, 237, 0.1)"
      ctx.lineWidth = 1

      // Draw crystal facets
      const size = crystal.size * (0.3 + crystal.growth * 0.7)
      ctx.beginPath()
      for (let i = 0; i < crystal.facets; i++) {
        const angle = (i / crystal.facets) * Math.PI * 2
        const x = Math.cos(angle) * size
        const y = Math.sin(angle) * size
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Inner crystal structure
      ctx.beginPath()
      for (let i = 0; i < crystal.facets; i++) {
        const angle = (i / crystal.facets) * Math.PI * 2
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size)
      }
      ctx.stroke()

      // Wisdom text
      if (crystal.growth > 0.5) {
        ctx.font = "8px monospace"
        ctx.fillStyle = isDark ? "#8B5CF6" : "#7C3AED"
        ctx.textAlign = "center"
        ctx.fillText(crystal.wisdom, 0, -size - 10)
      }

      ctx.restore()
    }

    const drawBrainWave = (ctx: CanvasRenderingContext2D, wave: BrainWave) => {
      ctx.save()
      ctx.globalAlpha = wave.opacity

      const isDark = theme === "dark"
      let color = isDark ? "#10B981" : "#059669"
      switch (wave.type) {
        case "alpha":
          color = isDark ? "#10B981" : "#059669"
          break
        case "beta":
          color = isDark ? "#3B82F6" : "#2563EB"
          break
        case "gamma":
          color = isDark ? "#F59E0B" : "#D97706"
          break
        case "theta":
          color = isDark ? "#8B5CF6" : "#7C3AED"
          break
      }

      ctx.strokeStyle = color
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.moveTo(0, wave.y)

      for (let x = 0; x < canvas.width / window.devicePixelRatio; x += 2) {
        const y = wave.y + Math.sin((x / wave.wavelength + wave.phase) * Math.PI * 2) * wave.amplitude
        ctx.lineTo(x, y)
      }
      ctx.stroke()

      ctx.restore()
    }

    const drawKnowledgeParticle = (ctx: CanvasRenderingContext2D, particle: KnowledgeParticle) => {
      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.globalAlpha = particle.opacity

      const isDark = theme === "dark"
      ctx.fillStyle = isDark ? "#F59E0B" : "#D97706"
      ctx.strokeStyle = isDark ? "#F59E0B" : "#D97706"

      // Particle core
      ctx.beginPath()
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
      ctx.fill()

      // Concept text
      ctx.font = "8px monospace"
      ctx.textAlign = "center"
      ctx.fillText(particle.concept, 0, -particle.size - 5)

      // Magnetism field
      if (particle.magnetism > 30) {
        ctx.globalAlpha = particle.opacity * 0.3
        ctx.beginPath()
        ctx.arc(0, 0, particle.magnetism, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      // Update and draw brain waves
      brainWavesRef.current.forEach((wave) => {
        wave.phase += wave.frequency
        drawBrainWave(ctx, wave)
      })

      // Update neural network
      neuronsRef.current.forEach((neuron, index) => {
        // Charge accumulation
        neuron.charge += Math.random() * 2
        if (neuron.charge > neuron.maxCharge) neuron.charge = neuron.maxCharge

        // Firing
        if (neuron.charge > neuron.firingThreshold && Date.now() - neuron.lastFired > 1000) {
          neuron.lastFired = Date.now()
          neuron.charge = 0

          // Activate synapses
          neuron.connections.forEach((connectionIndex) => {
            const synapse = synapsesRef.current.find((s) => s.from === index && s.to === connectionIndex)
            if (synapse) {
              synapse.isActive = true
              synapse.pulsePosition = 0
            }
          })
        }

        drawNeuron(ctx, neuron, index)
      })

      // Update synapses
      synapsesRef.current.forEach((synapse) => {
        if (synapse.isActive) {
          synapse.pulsePosition += 0.05
          if (synapse.pulsePosition >= 1) {
            synapse.isActive = false
            synapse.pulsePosition = 0
            // Charge target neuron
            const targetNeuron = neuronsRef.current[synapse.to]
            if (targetNeuron) {
              targetNeuron.charge += synapse.strength * 20
            }
          }
        }
        drawSynapse(ctx, synapse)
      })

      // Update thought crystals
      crystalsRef.current.forEach((crystal) => {
        crystal.rotation += crystal.rotationSpeed
        if (Math.random() < 0.001) {
          crystal.crystallizing = true
        }
        if (crystal.crystallizing) {
          crystal.growth = Math.min(1, crystal.growth + 0.01)
          if (crystal.growth >= 1) {
            crystal.crystallizing = false
          }
        }
        drawThoughtCrystal(ctx, crystal)
      })

      // Update knowledge particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width / window.devicePixelRatio
        if (particle.x > canvas.width / window.devicePixelRatio) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height / window.devicePixelRatio
        if (particle.y > canvas.height / window.devicePixelRatio) particle.y = 0

        // Magnetic attraction to other particles
        particlesRef.current.forEach((other) => {
          if (other !== particle) {
            const dx = other.x - particle.x
            const dy = other.y - particle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < particle.magnetism && distance > 0) {
              const force = 0.001
              particle.vx += (dx / distance) * force
              particle.vy += (dy / distance) * force
            }
          }
        })

        drawKnowledgeParticle(ctx, particle)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    initNeuralNetwork()
    initThoughtCrystals()
    initBrainWaves()
    initKnowledgeParticles()
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
