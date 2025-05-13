"use client"

import { useEffect, useRef, useState } from "react"

// Sample domain names
const domains = [
  "freedom.org",
  "liberty-tech.com",
  "patriot-university.edu",
  "truth-network.org",
  "sovereign-systems.io",
  "heritage-alliance.org",
  "liberty-college.edu",
  "constitutional-rights.org",
  "digital-sovereignty.com",
  "parallel-economy.net",
  "faith-freedom.org",
  "american-values.com",
  "truth-archives.org",
  "decentralized-future.io",
  "free-speech-platform.com",
]

export default function DomainMarquee() {
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Calculate animation duration based on content length
  const [animationDuration, setAnimationDuration] = useState(30)

  // Measure container and content to determine duplication needs
  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const updateWidths = () => {
        const containerWidth = containerRef.current?.offsetWidth || 0
        setContainerWidth(containerWidth)

        const contentWidth = contentRef.current?.scrollWidth || 0

        // Adjust animation duration based on content length
        // Longer content should move at the same speed as shorter content
        const calculatedDuration = Math.max(20, contentWidth / 50)
        setAnimationDuration(calculatedDuration)
      }

      updateWidths()

      // Update measurements on resize
      window.addEventListener("resize", updateWidths)
      return () => window.removeEventListener("resize", updateWidths)
    }
  }, [])

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-3 overflow-hidden" ref={containerRef}>
      <div className="relative">
        {/* Left fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-gray-100 dark:from-gray-800 to-transparent"></div>

        {/* Right fade effect */}
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-gray-100 dark:from-gray-800 to-transparent"></div>

        {/* Scrolling content */}
        <div
          className="whitespace-nowrap"
          style={{
            transform: "translateX(-100%)",
            animation: `scrollRight ${animationDuration}s linear infinite`,
          }}
          ref={contentRef}
        >
          {/* Duplicate domains to create seamless loop */}
          {[...domains, ...domains, ...domains].map((domain, index) => (
            <span key={`${domain}-${index}`} className="inline-block mx-6 text-gray-600 dark:text-gray-300 font-mono">
              {domain}
            </span>
          ))}
        </div>
      </div>

      {/* Add the animation keyframes */}
      <style jsx>{`
        @keyframes scrollRight {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  )
}
