"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"

interface BBLogoAuthProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  forceDark?: boolean
  forceLight?: boolean
}

// Export as both named and default export to support both import styles
export function BBLogoAuth({ size = "md", className, forceDark = false, forceLight = false }: BBLogoAuthProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  // Set mounted to true on client
  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  // Determine which logo to use based on theme and force options
  let logoSrc = "/bb-logo.png" // Default to light logo

  if (mounted) {
    if (forceDark) {
      logoSrc = "/BigBasedIconInvert.png"
    } else if (forceLight) {
      logoSrc = "/bb-logo.png"
    } else {
      logoSrc = theme === "dark" ? "/BigBasedIconInvert.png" : "/bb-logo.png"
    }
  }

  return (
    <div className={cn(sizeClasses[size], "relative", className)}>
      <Image src={logoSrc || "/placeholder.svg"} alt="BigBased Logo" fill className="object-contain" priority />
    </div>
  )
}

// Also export as default for backward compatibility
export default BBLogoAuth
