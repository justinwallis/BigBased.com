"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getImageUrl, getFallbackImageUrl } from "@/utils/image-url"

interface SafeImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export default function SafeImage({ src, alt, width, height, className = "", priority = false }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(getImageUrl(src))
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    // Reset error state when src changes
    setError(false)
    setImgSrc(getImageUrl(src))
  }, [src])

  const handleError = () => {
    if (!error) {
      console.warn(`Image failed to load: ${imgSrc}`)
      setError(true)
      setImgSrc(getFallbackImageUrl(width, height))
    }
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${error ? "opacity-70" : ""}`}
        onError={handleError}
        priority={priority}
        unoptimized={process.env.NODE_ENV === "development"}
        crossOrigin="anonymous" // Add this to avoid CORS issues
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
          {alt || "Image not available"}
        </div>
      )}
    </div>
  )
}
