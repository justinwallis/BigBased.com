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

export function BBLogo({ size = "md", className, inverted = false }: BBLogoProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  // Determine the effective theme (handle system theme detection)
  const effectiveTheme = theme === "system" ? systemTheme : theme

  // Use the inverted logo in dark mode, unless explicitly overridden by the inverted prop
  const logoSrc = mounted
    ? inverted || effectiveTheme === "dark"
      ? "/BigBasedIconInvert.png"
      : "/bb-logo.png"
    : typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "/BigBasedIconInvert.png"
      : "/bb-logo.png"

  return (
    <div className={cn(sizeClasses[size], "relative", className)}>
      <Image src={logoSrc || "/placeholder.svg"} alt="BigBased Logo" fill className="object-contain" priority />
    </div>
  )
}

export default BBLogo
