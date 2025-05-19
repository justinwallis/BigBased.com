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
  const [isLoaded, setIsLoaded] = useState(false)

  // Wait for preloader to finish before showing
  useEffect(() => {
    // Check if document is fully loaded
    if (document.readyState === "complete") {
      setIsLoaded(true)
    } else {
      window.addEventListener("load", () => setIsLoaded(true))
      return () => window.removeEventListener("load", () => setIsLoaded(true))
    }
  }, [])

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

  if (announcements.length === 0 || !isLoaded) return null

  const currentAnnouncement = announcements[currentIndex]

  return (
    <div className="w-full bg-gradient-to-r from-black via-gray-900 to-black dark:bg-black text-white py-1 px-4">
      <div className="container mx-auto flex items-center justify-between">
        {announcements.length > 1 && (
          <button
            onClick={goToPrev}
            className="p-0.5 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft size={12} />
          </button>
        )}

        <div
          className="text-xs text-center flex-1 mx-2"
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
            className="p-0.5 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  )
}
