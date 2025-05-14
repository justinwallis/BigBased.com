"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { getImageUrl } from "@/utils/image-url"

interface BBLogoProps {
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function BBLogo({ width = 64, height = 64, className = "", priority = false }: BBLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine logo source based on theme
  const logoSrc =
    mounted && resolvedTheme === "dark" ? getImageUrl("/BigBasedIconInvert.png") : getImageUrl("/bb-logo.png")

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) return null

  return (
    <Image
      src={logoSrc || "/placeholder.svg"}
      alt="Big Based Logo"
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={true}
      crossOrigin="anonymous"
    />
  )
}
