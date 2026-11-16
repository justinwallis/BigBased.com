"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface BBLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  inverted?: boolean
}

// Use the existing original light/inverted assets. Let the actual dark
// class drive visibility instead of relying on mount-time theme detection.
// This avoids low-contrast logo flashes during hydration and SSR previews.
export default function BBLogo({ size = "md", className, inverted = false }: BBLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  return (
    <div className={cn(sizeClasses[size], "relative", className)}>
      {inverted ? (
        <Image src="/BigBasedIconInvert.png" alt="BigBased Logo" fill className="object-contain" priority />
      ) : (
        <>
          <Image src="/bb-logo.png" alt="BigBased Logo" fill className="object-contain dark:hidden" priority />
          <Image src="/BigBasedIconInvert.png" alt="" aria-hidden="true" fill className="hidden object-contain dark:block" priority />
        </>
      )}
    </div>
  )
}
