"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface BBLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  inverted?: boolean
}

export default function BBLogo({ size = "md", className, inverted = false }: BBLogoProps) {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  // Use the inverted logo in dark mode, unless explicitly overridden by the inverted prop
  const logoSrc = inverted || isDarkMode ? "/BigBasedIconInvert.png" : "/bb-logo.png"

  return (
    <div className={cn(sizeClasses[size], "relative", className)}>
      <Image src={logoSrc || "/placeholder.svg"} alt="BigBased Logo" fill className="object-contain" priority />
    </div>
  )
}
