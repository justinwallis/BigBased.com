"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface BBLogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
  color?: "white" | "black" | "default" // Added color prop
}

export default function BBLogo({ size = "md", className, color = "default" }: BBLogoProps) {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const logoSrc =
    color === "white"
      ? "/BigBasedIconInvert.png"
      : color === "black"
        ? "/BigBasedIcon.png"
        : isDarkMode
          ? "/BigBasedIconInvert.png"
          : "/BigBasedIcon.png"

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  }

  return (
    <Image
      src={logoSrc || "/placeholder.svg"}
      alt="BigBased Logo"
      // Removed explicit width and height, relying on sizeClasses
      className={cn("object-contain", sizeClasses[size], className)}
      priority
    />
  )
}
