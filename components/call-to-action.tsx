"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import DigitalCross from "./digital-cross"
import Image from "next/image"

export default function CallToAction() {
  const [isHovered, setIsHovered] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    let animationId: number
    let time = 0

    // Cloud data with realistic properties
    const clouds = Array.from({ length: 12 }, (_, i) => ({
      x: i * 200 + Math.random() * 100 - 50,
      y: 50 + Math.random() * 150,
      size: 60 + Math.random() * 80,
      speed: 0.2 + Math.random() * 0.3,
      opacity: 0.7 + Math.random() * 0.3,
      puffs: Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => ({
        offsetX: Math.random() * 120 - 60,
        offsetY: Math.random() * 40 - 20,
        size: 0.6 + Math.random() * 0.8,
      })),
    }))

    // Grass blade data
    let grassBlades: Array<{
      x: number
      height: number
      phase: number
      speed: number
      thickness: number
    }> = []

    const initGrass = () => {
      const width = canvas.width / window.devicePixelRatio
      grassBlades = Array.from({ length: Math.floor(width / 3) }, (_, i) => ({
        x: i * 3 + Math.random() * 2,
        height: 20 + Math.random() * 40,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
        thickness: 1 + Math.random() * 2,
      }))
    }

    const drawCloud = (cloud: any) => {
      ctx.save()
      ctx.globalAlpha = cloud.opacity

      // Create realistic cloud shape with multiple puffs
      cloud.puffs.forEach((puff: any) => {
        const gradient = ctx.createRadialGradient(
          cloud.x + puff.offsetX,
          cloud.y + puff.offsetY,
          0,
          cloud.x + puff.offsetX,
          cloud.y + puff.offsetY,
          cloud.size * puff.size,
        )
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)")
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.6)")
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(cloud.x + puff.offsetX, cloud.y + puff.offsetY, cloud.size * puff.size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.restore()
    }

    const drawHills = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      // Multiple hill layers for depth
      const hillLayers = [
        {
          baseHeight: height * 0.4,
          color: "rgba(34, 139, 34, 0.3)",
          amplitude: 60,
          frequency: 0.003,
          offset: 0,
        },
        {
          baseHeight: height * 0.5,
          color: "rgba(50, 150, 50, 0.4)",
          amplitude: 80,
          frequency: 0.004,
          offset: 100,
        },
        {
          baseHeight: height * 0.6,
          color: "rgba(70, 170, 70, 0.5)",
          amplitude: 100,
          frequency: 0.005,
          offset: 200,
        },
        {
          baseHeight: height * 0.75,
          color: "rgba(90, 190, 90, 0.6)",
          amplitude: 60,
          frequency: 0.006,
          offset: 300,
        },
      ]

      hillLayers.forEach((layer) => {
        ctx.fillStyle = layer.color
        ctx.beginPath()
        ctx.moveTo(0, height)

        // Create smooth, natural hill curves
        for (let x = 0; x <= width; x += 5) {
          const y =
            layer.baseHeight +
            Math.sin((x + layer.offset + time * 10) * layer.frequency) * layer.amplitude +
            Math.sin((x + layer.offset + time * 15) * layer.frequency * 2) * (layer.amplitude * 0.3) +
            Math.sin((x + layer.offset + time * 8) * layer.frequency * 0.5) * (layer.amplitude * 0.5)

          if (x === 0) {
            ctx.lineTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.lineTo(width, height)
        ctx.closePath()
        ctx.fill()
      })
    }

    const drawGrass = () => {
      const height = canvas.height / window.devicePixelRatio

      grassBlades.forEach((blade) => {
        const sway = Math.sin(time * blade.speed + blade.phase) * 8
        const baseY = height * 0.85

        // Create gradient for grass blade
        const gradient = ctx.createLinearGradient(0, baseY - blade.height, 0, height)
        gradient.addColorStop(0, "rgba(124, 252, 0, 0.8)")
        gradient.addColorStop(0.7, "rgba(50, 205, 50, 0.9)")
        gradient.addColorStop(1, "rgba(34, 139, 34, 1)")

        ctx.strokeStyle = gradient
        ctx.lineWidth = blade.thickness
        ctx.lineCap = "round"

        ctx.beginPath()
        ctx.moveTo(blade.x, height)

        // Create natural grass curve
        const midX = blade.x + sway * 0.5
        const midY = baseY - blade.height * 0.6
        const topX = blade.x + sway
        const topY = baseY - blade.height

        ctx.quadraticCurveTo(midX, midY, topX, topY)
        ctx.stroke()
      })
    }

    const animate = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      if (grassBlades.length === 0) {
        initGrass()
      }

      time += 0.016

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height)
      skyGradient.addColorStop(0, "rgba(135, 206, 235, 0.3)")
      skyGradient.addColorStop(0.7, "rgba(220, 220, 220, 0.2)")
      skyGradient.addColorStop(1, "rgba(240, 248, 255, 0.1)")

      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, width, height)

      // Draw hills
      drawHills()

      // Draw and animate clouds
      clouds.forEach((cloud) => {
        cloud.x += cloud.speed
        if (cloud.x > width + 200) {
          cloud.x = -200
        }
        drawCloud(cloud)
      })

      // Draw grass
      drawGrass()

      animationId = requestAnimationFrame(animate)
    }

    setTimeout(() => {
      animate()
    }, 100)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <section className="py-24 px-8 md:px-16 relative overflow-hidden">
      {/* Beautiful Realistic Landscape Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />

      {/* Digital cross background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 5 }}>
        <div className="w-[90%] h-[90%] digital-cross-pulse">
          {/* Light mode cross */}
          <div className="block dark:hidden w-full h-full">
            <DigitalCross />
          </div>
          {/* Dark mode cross - sized to match light mode exactly */}
          <div className="hidden dark:block w-full h-full relative">
            <Image
              src="/digitalcrossInvert.png"
              alt="Digital Cross"
              fill
              style={{ objectFit: "contain" }}
              priority
              className="opacity-70"
            />
          </div>
        </div>
      </div>

      {/* Binary code background */}
      <div
        className="binary-background absolute inset-0 opacity-10 select-none pointer-events-none"
        style={{ zIndex: 3 }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="binary-row" style={{ top: `${i * 5}%`, animationDelay: `${i * 0.1}s` }}>
            {Array.from({ length: 10 }).map((_, j) => (
              <span
                key={j}
                className="inline-block mx-1 text-gray-400 dark:text-gray-500 opacity-50"
                style={{ animationDelay: `${j * 0.05}s` }}
              >
                {Math.random() > 0.5 ? "1" : "0"}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="text-center relative z-10 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight dark:text-white text-shadow-sm">
          Embrace a Future
          <br />
          Rooted in God, Freedom,
          <br />
          and Responsibility.
        </h2>
        <p className="text-lg mb-12 max-w-3xl mx-auto dark:text-gray-200 text-shadow-sm">
          If Toasty can go from soy-fueled excuses to Big Based greatness, what's stopping you? The tools the truth, and
          the blueprint are all here. The only question is: Are you ready to join us?
        </p>
        <Link
          href="/join"
          className={`inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-medium text-lg relative overflow-hidden transition-all duration-300 ${isHovered ? "transform scale-105" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="relative z-10">Join the Revolution</span>
          {isHovered && (
            <span className="absolute inset-0 bg-black dark:bg-white">
              <span className="absolute inset-0 binary-pulse opacity-30"></span>
            </span>
          )}
        </Link>
      </div>
    </section>
  )
}
