import Image from "next/image"
import { cn } from "@/lib/utils"

interface BBLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  inverted?: boolean
}

export default function BBLogo({ size = "md", className, inverted = false }: BBLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  return (
    <div className={cn(sizeClasses[size], "relative", className)}>
      <Image
        src="/bb-logo.png"
        alt="BigBased Logo"
        fill
        className={cn("object-contain", inverted && "filter invert")}
        priority
      />
    </div>
  )
}
