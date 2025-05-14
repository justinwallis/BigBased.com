"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { logoItems } from "@/data/logo-items"
import OptimizedImage from "./optimized-image"

interface LogoInfo {
  id: number
  name: string
  image: string
  alt: string
  url: string
  description: string
  foundedYear: string
  location: string
  detailedInfo: string
  featuredImage: string
}

interface LogoInfoSectionProps {
  selectedLogo: LogoInfo | null
  isHovering: boolean
}

export default function LogoInfoSection({ selectedLogo, isHovering }: LogoInfoSectionProps) {
  const [prevLogo, setPrevLogo] = useState<LogoInfo | null>(null)
  const [displayedLogo, setDisplayedLogo] = useState<LogoInfo | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Initialize with the first logo when component mounts
  useEffect(() => {
    if (logoItems.length > 0 && !displayedLogo) {
      setDisplayedLogo(logoItems[0])
    }
  }, [displayedLogo])

  // Update the displayed logo when selectedLogo changes
  useEffect(() => {
    if (selectedLogo && selectedLogo !== displayedLogo) {
      setPrevLogo(displayedLogo)
      setDisplayedLogo(selectedLogo)
      setIsTransitioning(true)

      // Reset transition state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [selectedLogo, displayedLogo])

  // If no logo is selected and we're not hovering, show empty state
  if (!displayedLogo) {
    return (
      <div className="bg-gray-50 border-t border-gray-200 py-6 px-8 min-h-[180px] flex items-center justify-center">
        <p className="text-gray-500 text-center">Loading partner information...</p>
      </div>
    )
  }

  return (
    <div className="logo-info-section overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <AnimatePresence mode="wait">
        {displayedLogo && (
          <motion.div
            key={displayedLogo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="py-6 px-8 md:flex items-start gap-6"
          >
            <div className="md:w-1/4 mb-4 md:mb-0">
              <div className="relative h-32 w-full md:h-40 md:w-full rounded-lg overflow-hidden mb-3">
                <OptimizedImage
                  src={displayedLogo.featuredImage || "/placeholder.svg?height=160&width=320&query=featured"}
                  alt={`${displayedLogo.name} featured image`}
                  fill
                  className="object-cover"
                  fallbackSrc="/placeholder.svg?key=dna4w"
                />
              </div>
              <div className="flex justify-center">
                <OptimizedImage
                  src={displayedLogo.image || "/placeholder.svg?height=40&width=120&query=logo"}
                  alt={displayedLogo.alt}
                  width={120}
                  height={40}
                  className="object-contain h-8"
                  fallbackSrc="/placeholder.svg?key=qwnbp"
                />
              </div>
            </div>

            <div className="md:w-3/4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold dark:text-white">{displayedLogo.name}</h3>
                <Link
                  href={displayedLogo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  Visit <ExternalLink size={14} />
                </Link>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{displayedLogo.description}</p>
              <p className="text-sm mb-4 dark:text-gray-200">{displayedLogo.detailedInfo}</p>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <span className="font-semibold">Founded:</span> {displayedLogo.foundedYear}
                </div>
                <div>
                  <span className="font-semibold">Location:</span> {displayedLogo.location}
                </div>
                <div className="ml-auto italic text-xs text-gray-400 dark:text-gray-500">
                  Hover over logos above to learn more about our partners
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
