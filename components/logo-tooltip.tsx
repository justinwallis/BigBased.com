"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useImageLoading, useResourceLoading } from "@/hooks/use-resource-loading"

interface LogoTooltipProps {
  name: string
  description: string
  detailedInfo: string
  foundedYear: string
  location: string
  image: string
  tooltipImage: string
  alt: string
  url: string
}

export default function LogoTooltip({
  name,
  description,
  detailedInfo,
  foundedYear,
  location,
  image,
  tooltipImage,
  alt,
  url,
}: LogoTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const logoRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Register this logo with the loading manager
  const { markLoaded } = useResourceLoading(`logo-${name}`, 0.5)

  // Preload the logo image
  useImageLoading(`logo-image-${name}`, image, 0.2)

  // Preload the tooltip image when hovering
  const [tooltipImageLoaded, setTooltipImageLoaded] = useState(false)
  useEffect(() => {
    if (showTooltip && !tooltipImageLoaded) {
      const img = new Image()
      img.onload = () => setTooltipImageLoaded(true)
      img.src = tooltipImage
    }
  }, [showTooltip, tooltipImage, tooltipImageLoaded])

  // Mark this logo as loaded when mounted
  useEffect(() => {
    markLoaded()
  }, [markLoaded])

  // Handle tooltip positioning and visibility
  useEffect(() => {
    if (!showTooltip) return

    // Ensure tooltip stays within viewport
    const handlePosition = () => {
      if (!tooltipRef.current || !logoRef.current) return

      const logoRect = logoRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      // Check if tooltip would go off the right edge
      const viewportWidth = window.innerWidth
      let leftPosition = logoRect.left + logoRect.width / 2 - tooltipRect.width / 2

      // Adjust if off screen
      if (leftPosition < 10) leftPosition = 10
      if (leftPosition + tooltipRect.width > viewportWidth - 10) {
        leftPosition = viewportWidth - tooltipRect.width - 10
      }

      // Position tooltip
      tooltipRef.current.style.left = `${leftPosition}px`
      tooltipRef.current.style.top = `${logoRect.bottom + window.scrollY + 10}px`
    }

    // Initial positioning
    setTimeout(handlePosition, 10)

    // Update position on scroll or resize
    window.addEventListener("scroll", handlePosition)
    window.addEventListener("resize", handlePosition)

    return () => {
      window.removeEventListener("scroll", handlePosition)
      window.removeEventListener("resize", handlePosition)
    }
  }, [showTooltip])

  return (
    <div
      ref={logoRef}
      className="relative mx-2 transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-60 cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Link href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${name} website`}>
        <Image src={image || "/placeholder.svg"} alt={alt} width={85} height={28} className="object-contain h-7" />
      </Link>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-[1000] bg-white shadow-xl rounded-lg overflow-hidden pointer-events-none"
          style={{
            width: "320px",
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 0.3s, transform 0.3s",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          {/* Tooltip Image Header */}
          <div className="relative w-full h-32 bg-gray-100">
            <Image
              src={tooltipImage || "/placeholder.svg"}
              alt={`${name} featured image`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-3 text-white">
              <h3 className="font-bold text-lg">{name}</h3>
              <p className="text-sm opacity-90">{description}</p>
            </div>
          </div>

          {/* Tooltip Content */}
          <div className="p-4">
            <p className="text-sm text-gray-700 mb-3">{detailedInfo}</p>

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <div>
                <span className="font-semibold">Founded:</span> {foundedYear}
              </div>
              <div>
                <span className="font-semibold">Location:</span> {location}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-right text-blue-600">
              Click logo to visit website
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
