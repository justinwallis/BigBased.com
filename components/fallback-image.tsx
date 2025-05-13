"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallback?: string
}

export default function FallbackImage({ src, alt, fallback, ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  // Generate a placeholder URL if no fallback is provided
  const getFallback = () => {
    if (fallback) return fallback

    const width = props.width || 100
    const height = props.height || 100
    return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(alt || "Image")}`
  }

  return <Image {...props} src={imgSrc || "/placeholder.svg"} alt={alt} onError={() => setImgSrc(getFallback())} />
}
