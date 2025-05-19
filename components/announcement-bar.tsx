"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample announcements - replace with your actual content
const announcements = [
  "New digital sovereignty resources available in our library",
  "Join our community event on May 25th",
  "Latest cultural commentary now published",
  "Explore our expanded truth archives section",
]

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-rotate announcements
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length)
  }

  return (
    <div
      className="w-full bg-[#000000] dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-1"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between px-4">
        <button
          onClick={goToPrevious}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Previous announcement"
        >
          <ChevronLeft size={12} />
        </button>

        <div className="flex-1 text-center overflow-hidden whitespace-nowrap text-xs">
          {announcements[currentIndex]}
        </div>

        <button
          onClick={goToNext}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Next announcement"
        >
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  )
}
