"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { useTheme } from "next-themes"

interface BBLogoProps {
  size?: "sm" | "md" | "lg"
  color?: "black" | "white" // Add color prop
}

export default function BBLogo({ size = "md", color }: BBLogoProps) {
  const { theme } = useTheme()
  const logoSrc =
    color === "black"
      ? "/bb-logo.png"
      : color === "white"
        ? "/BigBasedIconInvert.png"
        : theme === "dark"
          ? "/BigBasedIconInvert.png"
          : "/bb-logo.png"

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-16 w-16",
  }

  return (
    <Image
      src={logoSrc || "/placeholder.svg"}
      alt="BigBased Logo"
      width={size === "sm" ? 24 : size === "md" ? 32 : 64}
      height={size === "sm" ? 24 : size === "md" ? 32 : 64}
      className={cn("object-contain", sizeClasses[size])}
      priority
    />
  )
}
