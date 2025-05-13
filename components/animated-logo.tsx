"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import OptimizedImage from "./optimized-image"

interface AnimatedLogoProps {
  size?: "small" | "medium" | "large" | "extraLarge" | "xxl"
  className?: string
  pulseEffect?: boolean
}

export function AnimatedLogo({ size = "medium", className = "", pulseEffect = false }: AnimatedLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the logo based on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine dimensions based on size prop
  const getDimensions = () => {
    switch (size) {
      case "small":
        return { width: 60, height: 60 }
      case "large":
        return { width: 180, height: 180 }
      case "extraLarge":
        return { width: 240, height: 240 }
      case "xxl":
        return { width: 480, height: 480 } // Double the extraLarge size
      case "medium":
      default:
        return { width: 120, height: 120 }
    }
  }

  const { width, height } = getDimensions()

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return <div style={{ width, height }} />

  // Use the appropriate logo based on the theme
  const logoSrc = resolvedTheme === "dark" ? "/BB_Logo_Animation_invert_new.gif" : "/BB_Logo_Animation.gif"
  const fallbackSrc = `/placeholder.svg?height=${height}&width=${width}&query=Big Based Logo`

  return (
    <div className={`relative ${className} ${pulseEffect ? "logo-pulse" : ""}`} style={{ width, height }}>
      <OptimizedImage
        src={logoSrc}
        alt="Big Based Logo Animation"
        width={width}
        height={height}
        className="object-contain"
        priority
        fallbackSrc={fallbackSrc}
      />
    </div>
  )
}
