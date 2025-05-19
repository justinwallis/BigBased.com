"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

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
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
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
        setDirection(1) // Moving right for auto-rotation
        setCurrentIndex((prev) => (prev + 1) % announcements.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isPaused])

  const goToPrev = () => {
    setDirection(-1) // Moving left
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)
  }

  const goToNext = () => {
    setDirection(1) // Moving right
    setCurrentIndex((prev) => (prev + 1) % announcements.length)
  }

  if (announcements.length === 0 || !isLoaded) return null

  const currentAnnouncement = announcements[currentIndex]

  // Animation variants for swipe and fade
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  return (
    <div
      className="announcement-bar w-full text-white py-1 isolate overflow-hidden"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div className="w-full flex items-center justify-between" style={{ backgroundColor: "transparent" }}>
        {announcements.length > 1 && (
          <button
            onClick={goToPrev}
            className="px-4 py-0.5 hover:bg-black hover:bg-opacity-30 transition-colors z-10"
            aria-label="Previous announcement"
            style={{ backgroundColor: "transparent" }}
          >
            <ChevronLeft size={12} />
          </button>
        )}

        <div className="text-xs text-center flex-1 relative overflow-hidden" style={{ height: "18px" }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute w-full"
              style={{ backgroundColor: "transparent" }}
            >
              {currentAnnouncement.link ? (
                <a
                  href={currentAnnouncement.link}
                  className="hover:underline"
                  style={{ backgroundColor: "transparent", textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {currentAnnouncement.text}
                </a>
              ) : (
                <span
                  style={{ backgroundColor: "transparent", textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {currentAnnouncement.text}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {announcements.length > 1 && (
          <button
            onClick={goToNext}
            className="px-4 py-0.5 hover:bg-black hover:bg-opacity-30 transition-colors z-10"
            aria-label="Next announcement"
            style={{ backgroundColor: "transparent" }}
          >
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  )
}
