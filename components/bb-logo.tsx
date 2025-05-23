"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"

interface BBLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  inverted?: boolean
}

export default function BBLogo({ size = "md", className, inverted = false }: BBLogoProps) {
  // Add mounted state to prevent hydration mismatch
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

  // Only check theme after component is mounted to avoid hydration mismatch
  const isDarkMode = mounted && theme === "dark"

  // Use the inverted logo in dark mode, unless explicitly overridden by the inverted prop
  const logoSrc = mounted ? (inverted || theme === "dark" ? "/BigBasedIconInvert.png" : "/bb-logo.png") : "/bb-logo.png"

  // Log the logo source for debugging
  // useEffect(() => {
  //   if (mounted) {
  //     console.log("Logo source:", logoSrc, "isDarkMode:", isDarkMode)
  //   }
  // }, [logoSrc, isDarkMode, mounted])

  return (
    <div className={cn(sizeClasses[size], "relative", className)}>
      <Image src={logoSrc || "/placeholder.svg"} alt="BigBased Logo" fill className="object-contain" priority />
    </div>
  )
}
