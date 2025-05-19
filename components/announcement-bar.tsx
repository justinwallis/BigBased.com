"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Announcement = {
  id: number
  text: string
  link?: string
}

// Sample announcements - replace with your actual announcements
const announcements: Announcement[] = [
  { id: 1, text: "New digital sovereignty guide now available", link: "/resources" },
  { id: 2, text: "Join our community event on May 25th", link: "/events" },
  { id: 3, text: "Latest truth archives update: 500+ new documents added", link: "/archives" },
]

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-rotate announcements every 5 seconds
  useEffect(() => {
    if (!isPaused && announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isPaused])

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length)
  }

  if (announcements.length === 0) return null

  const currentAnnouncement = announcements[currentIndex]

  return (
    <div className="w-full bg-black dark:bg-gray-900 text-white py-1 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 flex justify-center items-center">
          {announcements.length > 1 && (
            <button
              onClick={goToPrev}
              className="mr-2 p-0.5 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Previous announcement"
            >
              <ChevronLeft size={12} />
            </button>
          )}

          <div
            className="text-xs text-center flex-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {currentAnnouncement.link ? (
              <a href={currentAnnouncement.link} className="hover:underline">
                {currentAnnouncement.text}
              </a>
            ) : (
              <span>{currentAnnouncement.text}</span>
            )}
          </div>

          {announcements.length > 1 && (
            <button
              onClick={goToNext}
              className="ml-2 p-0.5 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Next announcement"
            >
              <ChevronRight size={12} />
            </button>
          )}
        </div>

        {/* Optional: Dots indicator for multiple announcements */}
        {announcements.length > 1 && (
          <div className="hidden sm:flex items-center space-x-1 ml-2">
            {announcements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 w-1 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-600"}`}
                aria-label={`Go to announcement ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
