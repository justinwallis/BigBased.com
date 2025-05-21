"use client"

import { useTheme } from "@/components/theme-provider"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export function AuthLogo() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Set mounted to true on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Only check theme after component is mounted to avoid hydration mismatch
  const isDarkMode = mounted && theme === "dark"

  // Use the appropriate logo based on the theme
  const logoSrc = isDarkMode ? "/BigBasedIconInvert.png" : "/bb-logo.png"

  // Before mounting, render a placeholder div with the same dimensions
  // to prevent layout shift
  if (!mounted) {
    return (
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16" />
      </div>
    )
  }

  return (
    <div className="flex justify-center mb-8">
      <Link href="/" className="inline-block">
        <div className="relative w-16 h-16">
          <Image src={logoSrc || "/placeholder.svg"} alt="Big Based" fill className="object-contain" priority />
        </div>
        <div className="text-center mt-2 font-semibold">BIG BASED</div>
      </Link>
    </div>
  )
}
