"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface DNAStrand {
  x: number
  y: number
  height: number
  rotation: number
  rotationSpeed: number
  helixPhase: number
  dataPoints: string[]
  opacity: number
}

interface IdentityFragment {
  x: number
  y: number
  vx: number
  vy: number
  text: string
  opacity: number
  scale: number
  life: number
  maxLife: number
  fragmentType: "name" | "email" | "skill" | "achievement" | "preference"
}

interface BiometricScan {
  x: number
  y: number
  radius: number
  scanProgress: number
  scanType: "fingerprint" | "iris" | "facial" | "voice"
  opacity: number
}

interface QuantumState {
  x: number
  y: number
  states: string[]
  currentState: number
  transitionProgress: number
  opacity: number
  size: number
}

export default function IdentitySectionBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const dnaStrandsRef = useRef<DNAStrand[]>([])
  const identityFragmentsRef = useRef<IdentityFragment[]>([])
  const biometricScansRef = useRef<BiometricScan[]>([])
  const quantumStatesRef = useRef<QuantumState[]>([])
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

    // Initialize DNA strands
    const initDNAStrands = () => {
      dnaStrandsRef.current = []
      for (let i = 0; i < 3; i++) {
        dnaStrandsRef.current.push(createDNAStrand())
      }
    }

    // Initialize identity fragments
    const initIdentityFragments = () => {
      const fragmentCount = Math.min(25, Math.floor((canvas.width * canvas.height) / 30000))
      identityFragmentsRef.current = []
      for (let i = 0; i < fragmentCount; i++) {
        identityFragmentsRef.current.push(createIdentityFragment())
      }
    }

    // Initialize biometric scans
    const initBiometricScans = () => {
      biometricScansRef.current = []
      for (let i = 0; i < 4; i++) {
        biometricScansRef.current.push(createBiometricScan())
      }
    }

    // Initialize quantum states
    const initQuantumStates = () => {
      quantumStatesRef.current = []
      for (let i = 0; i < 8; i++) {
        quantumStatesRef.current.push(createQuantumState())
      }
    }

    const createDNAStrand = (): DNAStrand => ({
      x: Math.random() * (canvas.width / window.devicePixelRatio),
      y: Math.random() * (canvas.height / window.devicePixelRatio),
      height: Math.random() * 200 + 150,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      helixPhase: Math.random() * Math.PI * 2,
      dataPoints: ["USER_ID", "EMAIL", "PROFILE", "SKILLS", "BADGES", "SCORES", "FACTION", "DOMAINS"],
      opacity: Math.random() * 0.3 + 0.1,
    })

    const createIdentityFragment = (): IdentityFragment => {
      const fragments = {
        name: ["John.Based", "Sarah.Truth", "Mike.Digital", "Anna.Sovereign"],
        email: ["user@based.com", "truth@seeker.net", "digital@native.org"],
        skill: ["Truth Seeker", "Digital Native", "Code Warrior", "Faith Defender"],
        achievement: ["Verified", "Trusted", "Elite", "Pioneer"],
        preference: ["Privacy: High", "Theme: Dark", "Notifications: On"],
      }
      const types = Object.keys(fragments) as Array<keyof typeof fragments>
      const type = types[Math.floor(Math.random() * types.length)]

      return {
        x: Math.random() * (canvas.width / window.devicePixelRatio),
        y: Math.random() * (canvas.height / window.devicePixelRatio),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        text: fragments[type][Math.floor(Math.random() * fragments[type].length)],
        opacity: Math.random() * 0.4 + 0.2,
        scale: Math.random() * 0.5 + 0.5,
        life: 0,
        maxLife: Math.random() * 2000 + 3000,
        fragmentType: type,
      }
    }

    const createBiometricScan = (): BiometricScan => {
      const types: BiometricScan["scanType"][] = ["fingerprint", "iris", "facial", "voice"]
      return {
        x: Math.random() * (canvas.width / window.devicePixelRatio),
        y: Math.random() * (canvas.height / window.devicePixelRatio),
        radius: Math.random() * 30 + 20,
        scanProgress: 0,
        scanType: types[Math.floor(Math.random() * types.length)],
        opacity: Math.random() * 0.3 + 0.1,
      }
    }

    const createQuantumState = (): QuantumState => ({
      x: Math.random() * (canvas.width / window.devicePixelRatio),
      y: Math.random() * (canvas.height / window.devicePixelRatio),
      states: ["AUTHENTICATED", "ANONYMOUS", "VERIFIED", "PENDING", "SECURE"],
      currentState: 0,
      transitionProgress: 0,
      opacity: Math.random() * 0.4 + 0.2,
      size: Math.random() * 15 + 10,
    })

    // Drawing functions
    const drawDNAStrand = (ctx: CanvasRenderingContext2D, strand: DNAStrand) => {
      ctx.save()
      ctx.translate(strand.x, strand.y)
      ctx.rotate(strand.rotation)
      ctx.globalAlpha = strand.opacity

      const isDark = theme === "dark"
      ctx.strokeStyle = isDark ? "#10B981" : "#3B82F6"
      ctx.fillStyle = isDark ? "#10B981" : "#3B82F6"
      ctx.lineWidth = 2

      // Draw DNA helix
      const segments = 20
      for (let i = 0; i < segments; i++) {
        const y = (i / segments) * strand.height - strand.height / 2
        const phase1 = strand.helixPhase + (i / segments) * Math.PI * 4
        const phase2 = phase1 + Math.PI

        const x1 = Math.sin(phase1) * 20
        const x2 = Math.sin(phase2) * 20

        // Draw helix strands
        if (i > 0) {
          const prevY = ((i - 1) / segments) * strand.height - strand.height / 2
          const prevPhase1 = strand.helixPhase + ((i - 1) / segments) * Math.PI * 4
          const prevPhase2 = prevPhase1 + Math.PI
          const prevX1 = Math.sin(prevPhase1) * 20
          const prevX2 = Math.sin(prevPhase2) * 20

          ctx.beginPath()
          ctx.moveTo(prevX1, prevY)
          ctx.lineTo(x1, y)
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(prevX2, prevY)
          ctx.lineTo(x2, y)
          ctx.stroke()
        }

        // Draw connecting lines with data
        if (i % 3 === 0) {
          ctx.beginPath()
          ctx.moveTo(x1, y)
          ctx.lineTo(x2, y)
          ctx.stroke()

          // Add data point
          const dataIndex = Math.floor(i / 3) % strand.dataPoints.length
          ctx.font = "8px monospace"
          ctx.fillText(strand.dataPoints[dataIndex], Math.min(x1, x2) - 15, y - 5)
        }
      }

      ctx.restore()
    }

    const drawIdentityFragment = (ctx: CanvasRenderingContext2D, fragment: IdentityFragment) => {
      ctx.save()
      ctx.translate(fragment.x, fragment.y)
      ctx.scale(fragment.scale, fragment.scale)
      ctx.globalAlpha = fragment.opacity

      const isDark = theme === "dark"

      // Color code by fragment type
      let color = isDark ? "#10B981" : "#3B82F6"
      switch (fragment.fragmentType) {
        case "name":
          color = isDark ? "#F59E0B" : "#D97706"
          break
        case "email":
          color = isDark ? "#EF4444" : "#DC2626"
          break
        case "skill":
          color = isDark ? "#8B5CF6" : "#7C3AED"
          break
        case "achievement":
          color = isDark ? "#10B981" : "#059669"
          break
        case "preference":
          color = isDark ? "#6B7280" : "#4B5563"
          break
      }

      ctx.fillStyle = color
      ctx.strokeStyle = color

      // Draw fragment container
      ctx.beginPath()
      ctx.roundRect(-30, -8, 60, 16, 8)
      ctx.globalAlpha = fragment.opacity * 0.2
      ctx.fill()
      ctx.globalAlpha = fragment.opacity
      ctx.stroke()

      // Draw text
      ctx.font = "10px monospace"
      ctx.textAlign = "center"
      ctx.fillText(fragment.text, 0, 3)

      ctx.restore()
    }

    const drawBiometricScan = (ctx: CanvasRenderingContext2D, scan: BiometricScan) => {
      ctx.save()
      ctx.translate(scan.x, scan.y)
      ctx.globalAlpha = scan.opacity

      const isDark = theme === "dark"
      ctx.strokeStyle = isDark ? "#10B981" : "#3B82F6"
      ctx.lineWidth = 1

      switch (scan.scanType) {
        case "fingerprint":
          // Draw fingerprint pattern
          for (let i = 0; i < 5; i++) {
            ctx.beginPath()
            ctx.arc(0, 0, scan.radius * 0.2 + i * 3, 0, Math.PI * 2 * (scan.scanProgress / 100))
            ctx.stroke()
          }
          break

        case "iris":
          // Draw iris scan pattern
          ctx.beginPath()
          ctx.arc(0, 0, scan.radius, 0, Math.PI * 2)
          ctx.stroke()
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(Math.cos(angle) * scan.radius, Math.sin(angle) * scan.radius)
            ctx.stroke()
          }
          break

        case "facial":
          // Draw facial recognition grid
          const gridSize = 5
          for (let i = 0; i <= gridSize; i++) {
            const pos = (i / gridSize - 0.5) * scan.radius * 2
            ctx.beginPath()
            ctx.moveTo(pos, -scan.radius)
            ctx.lineTo(pos, scan.radius)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(-scan.radius, pos)
            ctx.lineTo(scan.radius, pos)
            ctx.stroke()
          }
          break

        case "voice":
          // Draw voice waveform
          for (let i = 0; i < 20; i++) {
            const x = (i / 20 - 0.5) * scan.radius * 2
            const height = Math.sin(scan.scanProgress * 0.1 + i * 0.5) * scan.radius * 0.5
            ctx.beginPath()
            ctx.moveTo(x, -height)
            ctx.lineTo(x, height)
            ctx.stroke()
          }
          break
      }

      // Draw scanning line
      const scanAngle = (scan.scanProgress / 100) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.cos(scanAngle) * scan.radius, Math.sin(scanAngle) * scan.radius)
      ctx.strokeStyle = isDark ? "#EF4444" : "#DC2626"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.restore()
    }

    const drawQuantumState = (ctx: CanvasRenderingContext2D, quantum: QuantumState) => {
      ctx.save()
      ctx.translate(quantum.x, quantum.y)
      ctx.globalAlpha = quantum.opacity

      const isDark = theme === "dark"
      ctx.fillStyle = isDark ? "#8B5CF6" : "#7C3AED"
      ctx.strokeStyle = isDark ? "#8B5CF6" : "#7C3AED"

      // Draw quantum particle
      ctx.beginPath()
      ctx.arc(0, 0, quantum.size, 0, Math.PI * 2)
      ctx.globalAlpha = quantum.opacity * 0.3
      ctx.fill()
      ctx.globalAlpha = quantum.opacity
      ctx.stroke()

      // Draw state text
      const currentStateText = quantum.states[quantum.currentState]
      ctx.font = "8px monospace"
      ctx.textAlign = "center"
      ctx.fillText(currentStateText, 0, -quantum.size - 5)

      // Draw quantum uncertainty effect
      if (quantum.transitionProgress > 0.5) {
        const nextState = (quantum.currentState + 1) % quantum.states.length
        ctx.globalAlpha = quantum.opacity * (quantum.transitionProgress - 0.5) * 2
        ctx.fillText(quantum.states[nextState], 0, quantum.size + 15)
      }

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      // Update and draw DNA strands
      dnaStrandsRef.current.forEach((strand, index) => {
        strand.rotation += strand.rotationSpeed
        strand.helixPhase += 0.02

        if (strand.helixPhase > Math.PI * 8) {
          dnaStrandsRef.current[index] = createDNAStrand()
        }

        drawDNAStrand(ctx, strand)
      })

      // Update and draw identity fragments
      identityFragmentsRef.current.forEach((fragment, index) => {
        fragment.x += fragment.vx
        fragment.y += fragment.vy
        fragment.life++

        // Wrap around screen
        if (fragment.x < -50) fragment.x = canvas.width / window.devicePixelRatio + 50
        if (fragment.x > canvas.width / window.devicePixelRatio + 50) fragment.x = -50
        if (fragment.y < -50) fragment.y = canvas.height / window.devicePixelRatio + 50
        if (fragment.y > canvas.height / window.devicePixelRatio + 50) fragment.y = -50

        if (fragment.life > fragment.maxLife) {
          identityFragmentsRef.current[index] = createIdentityFragment()
        }

        drawIdentityFragment(ctx, fragment)
      })

      // Update and draw biometric scans
      biometricScansRef.current.forEach((scan, index) => {
        scan.scanProgress += 2

        if (scan.scanProgress > 100) {
          biometricScansRef.current[index] = createBiometricScan()
        }

        drawBiometricScan(ctx, scan)
      })

      // Update and draw quantum states
      quantumStatesRef.current.forEach((quantum, index) => {
        quantum.transitionProgress += 0.01

        if (quantum.transitionProgress >= 1) {
          quantum.currentState = (quantum.currentState + 1) % quantum.states.length
          quantum.transitionProgress = 0
        }

        drawQuantumState(ctx, quantum)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    initDNAStrands()
    initIdentityFragments()
    initBiometricScans()
    initQuantumStates()
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
