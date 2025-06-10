"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react" // Import useState and useEffect

interface BBLogoProps {
  size?: "sm" | "md" | "lg" | "xl" // Re-added 'xl' size
  className?: string
  inverted?: boolean // Re-added 'inverted' prop
}

export default function BBLogo({ size = "md", className, inverted = false }: BBLogoProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", // Reverted to original md size
    lg: "w-16 h-16", // Reverted to original lg size
    xl: "w-24 h-24", // Re-added xl size
  }

  // Determine the effective theme (handle system theme detection)
  const effectiveTheme = theme === "system" ? systemTheme : theme

  // Use the inverted logo in dark mode, unless explicitly overridden by the inverted prop
  const logoSrc = mounted
    ? inverted || effectiveTheme === "dark"
      ? "/BigBasedIconInvert.png"
      : "/bb-logo.png" // Corrected light mode logo path
    : typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "/BigBasedIconInvert.png"
      : "/bb-logo.png" // Corrected light mode logo path for initial render

  return (
    <div className={cn(sizeClasses[size], "relative", className)}>
      <Image src={logoSrc || "/placeholder.svg"} alt="BigBased Logo" fill className="object-contain" priority />
    </div>
  )
}
