"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"

interface MarqueeLogoProps {
  image?: string
  alt: string
  url: string
  name: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const MarqueeLogo: React.FC<MarqueeLogoProps> = ({ image, alt, url, name, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className="mx-2 md:mx-4 transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-60"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${name} website`}>
        <Image
          src={image || "/placeholder.svg"}
          alt={alt}
          width={85}
          height={28}
          className="object-contain h-5 sm:h-6 md:h-7"
        />
      </Link>
    </div>
  )
}

export default MarqueeLogo
