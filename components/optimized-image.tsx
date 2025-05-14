"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { getImageUrl } from "@/utils/image-url"

interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

export default function OptimizedImage({ src, alt, fallbackSrc, ...props }: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Reset error state when src changes
    setError(false)

    // Handle different src types
    if (typeof src === "string") {
      setImgSrc(getImageUrl(src))
    } else {
      setImgSrc(src as any)
    }
  }, [src])

  // Generate a placeholder if needed
  const getPlaceholder = () => {
    if (fallbackSrc) return getImageUrl(fallbackSrc)

    const width = props.width || 100
    const height = props.height || 100
    return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(alt || "Image")}`
  }

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`)
    setError(true)
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return null

  // If there's an error, use the fallback
  const displaySrc = error ? getPlaceholder() : imgSrc

  return (
    <Image
      {...props}
      src={displaySrc || getPlaceholder()}
      alt={alt || "Image"}
      onError={handleError}
      unoptimized={true}
      crossOrigin="anonymous" // Add this to avoid CORS issues
    />
  )
}
