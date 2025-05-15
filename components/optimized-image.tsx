"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"

interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

export default function OptimizedImage({ src, alt, fallbackSrc, ...props }: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Reset error state when src changes
    setError(false)
    setLoaded(false) // Reset loaded state

    // Handle different src types
    if (typeof src === "string") {
      setImgSrc(src)
    } else {
      setImgSrc(src as any)
    }
  }, [src])

  // Generate a placeholder if needed
  const getPlaceholder = () => {
    if (fallbackSrc) return fallbackSrc

    const width = props.width || 100
    const height = props.height || 100
    return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(alt || "Image")}`
  }

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`)
    setError(true)
  }

  // If there's an error, use the fallback
  const displaySrc = error ? getPlaceholder() : imgSrc

  const handleLoad = () => {
    setLoaded(true)
  }

  return (
    <Image
      {...props}
      src={displaySrc || getPlaceholder()}
      alt={alt || "Image"}
      onError={handleError}
      onLoad={handleLoad}
      unoptimized={true}
      crossOrigin="anonymous" // Add this to avoid CORS issues
      className={`image-fade-in ${loaded ? "loaded" : ""} ${props.className || ""}`}
    />
  )
}
