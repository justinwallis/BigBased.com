"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  HandIcon as PrayingHands,
  Clock,
  User,
  X,
  Plus,
  Sparkles,
  DollarSign,
  Check,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

// Change the component name and functionality to display donations instead of prayers

// Update the component name and interface
// Change Prayer interface to Donation
interface Donation {
  id: string
  name: string
  amount: number
  content: string
  timestamp: string
  prayerCount: number
  isNew?: boolean
}

// Update the initial data to be donations
const initialDonations: Donation[] = [
  {
    id: "d1",
    name: "Sarah",
    amount: 25,
    content: "God bless this movement! Praying for your success.",
    timestamp: "2 hours ago",
    prayerCount: 24,
  },
  {
    id: "d2",
    name: "Michael",
    amount: 100,
    content: "For our nation and its future. Keep up the good work!",
    timestamp: "5 hours ago",
    prayerCount: 56,
  },
  {
    id: "d3",
    name: "Rebecca",
    amount: 50,
    content: "In memory of my mother who taught me to stand for truth.",
    timestamp: "1 day ago",
    prayerCount: 89,
  },
  {
    id: "d4",
    name: "John",
    amount: 75,
    content: "Grateful for this community. May God continue to bless your work.",
    timestamp: "2 days ago",
    prayerCount: 42,
  },
  {
    id: "d5",
    name: "Elizabeth",
    amount: 200,
    content: "For all those fighting for our values and freedoms.",
    timestamp: "3 days ago",
    prayerCount: 112,
  },
]

// Update the new donations pool
const newDonationsPool: Omit<Donation, "id" | "timestamp" | "prayerCount">[] = [
  {
    name: "David",
    amount: 30,
    content: "Standing with you in this important mission.",
  },
  {
    name: "Rachel",
    amount: 45,
    content: "For healing and restoration in our communities.",
  },
  {
    name: "Thomas",
    amount: 60,
    content: "Supporting the cause of truth and freedom.",
  },
  {
    name: "Hannah",
    amount: 25,
    content: "May God bless this work and multiply its impact.",
  },
  {
    name: "James",
    amount: 150,
    content: "For peace and unity in our divided world.",
  },
]

// Rename the component to DonationFeed
export default function DonationFeed() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  // Update state variable names
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newPrayer, setNewPrayer] = useState({ name: "", content: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [prayedFor, setPrayedFor] = useState<Record<string, boolean>>({})
  const [showSparkle, setShowSparkle] = useState<string | null>(null)
  const [messageSent, setMessageSent] = useState(false)

  // State for controlling which donations are visible
  const [visibleStartIndex, setVisibleStartIndex] = useState(0)
  const [visibleEndIndex, setVisibleEndIndex] = useState(3) // Show 4 donations at a time

  // Calculate if we can navigate up or down
  const canScrollUp = visibleStartIndex > 0
  const canScrollDown = visibleEndIndex < donations.length - 1

  const modalRef = useRef<HTMLDivElement>(null)
  const feedRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const donationRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Update localStorage key
  useEffect(() => {
    const loadDonations = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        // For demo, we'll use localStorage with a fallback to initial data
        const storedDonations = localStorage.getItem("bigbased-donations")
        const parsedDonations = storedDonations ? JSON.parse(storedDonations) : initialDonations

        // Simulate network delay
        setTimeout(() => {
          setDonations(parsedDonations)
          setIsLoading(false)
        }, 1200)
      } catch (error) {
        console.error("Error loading donations:", error)
        setDonations(initialDonations)
        setIsLoading(false)
      }
    }

    loadDonations()
  }, [])

  // Update localStorage saving
  useEffect(() => {
    if (donations.length > 0 && !isLoading) {
      localStorage.setItem("bigbased-donations", JSON.stringify(donations))
    }
  }, [donations, isLoading])

  // Update random donation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% chance of adding a new donation
      if (Math.random() < 0.2) {
        addRandomDonation()
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [donations])

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [modalRef])

  // Fix for wheel events - only stop propagation, don't prevent default
  useEffect(() => {
    if (!containerRef.current) return

    const handleWheel = (e: WheelEvent) => {
      // Stop propagation but don't prevent default
      // This allows the main page to scroll while preventing the donation box from scrolling
      e.stopPropagation()
    }

    const container = containerRef.current
    container.addEventListener("wheel", handleWheel)

    return () => {
      container.removeEventListener("wheel", handleWheel)
    }
  }, [])

  // When a new donation is added, update the visible indices if needed
  useEffect(() => {
    if (donations.some((d) => d.isNew)) {
      // If a new donation is added, show it at the top
      setVisibleStartIndex(0)
      setVisibleEndIndex(3)

      // Remove isNew flag after animation
      setTimeout(() => {
        setDonations(donations.map((p) => ({ ...p, isNew: false })))
      }, 5000)
    }
  }, [donations])

  // Update the random donation function
  const addRandomDonation = () => {
    if (newDonationsPool.length === 0) return

    const randomIndex = Math.floor(Math.random() * newDonationsPool.length)
    const randomDonation = newDonationsPool[randomIndex]

    const newDonationObj: Donation = {
      id: `d${Date.now()}`,
      name: randomDonation.name,
      amount: randomDonation.amount,
      content: randomDonation.content,
      timestamp: "Just now",
      prayerCount: 0,
      isNew: true,
    }

    setDonations((prev) => [newDonationObj, ...prev])
  }

  // Update the submit handler to reflect sending a prayer to admins
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!newPrayer.name.trim() || !newPrayer.content.trim()) {
      setError("Please fill out all fields")
      return
    }

    setIsSubmitting(true)
    setError("")

    // Simulate API call to send prayer to admins
    setTimeout(() => {
      // In a real implementation, this would send the prayer to admins
      setNewPrayer({ name: "", content: "" })
      setIsSubmitting(false)
      setMessageSent(true)

      // Hide the success message after 3 seconds
      setTimeout(() => {
        setMessageSent(false)
        setShowModal(false)
      }, 3000)
    }, 1000)
  }

  const handlePrayClick = (id: string) => {
    if (prayedFor[id]) return

    setPrayedFor((prev) => ({ ...prev, [id]: true }))
    setShowSparkle(id)
    setShowModal(true)

    setTimeout(() => {
      setShowSparkle(null)
    }, 2000)

    setDonations((prev) =>
      prev.map((donation) => (donation.id === id ? { ...donation, prayerCount: donation.prayerCount + 1 } : donation)),
    )
  }

  // Navigation functions
  const scrollUp = () => {
    if (!canScrollUp) return

    setVisibleStartIndex((prev) => Math.max(0, prev - 1))
    setVisibleEndIndex((prev) => Math.max(3, prev - 1))
  }

  const scrollDown = () => {
    if (!canScrollDown) return

    setVisibleStartIndex((prev) => Math.min(donations.length - 1, prev + 1))
    setVisibleEndIndex((prev) => Math.min(donations.length - 1, prev + 1))
  }

  // Get visible donations
  const visibleDonations = donations.slice(visibleStartIndex, visibleEndIndex + 1)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full relative">
      {/* Update the header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <DollarSign className="text-white mr-2" />
          <h3 className="text-white font-bold text-lg">Recent Donations</h3>
        </div>
        <button
          onClick={() => {
            setShowModal(true)
            setMessageSent(false)
          }}
          className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-1 rounded-full text-sm font-medium flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Send Prayer
        </button>
      </div>

      {/* Container for feed and navigation arrows */}
      <div className="relative" style={{ height: "500px" }} ref={containerRef}>
        {/* Feed content */}
        <div
          ref={feedRef}
          className="p-2 h-full"
          style={{
            overflowY: "hidden", // Hide scrollbars
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading donations...</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <DollarSign size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">No donations yet</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Be the first to donate and share your message of support
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {visibleDonations.map((donation) => (
                <motion.div
                  key={donation.id}
                  initial={donation.isNew ? { opacity: 0, y: 20 } : { opacity: 1 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`mb-3 p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  } ${donation.isNew ? "border-l-4 border-blue-500" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isDarkMode ? "bg-gray-600" : "bg-gray-200"
                        }`}
                      >
                        <User size={16} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
                      </div>
                      <div className="ml-2">
                        <div className="flex items-center">
                          <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {donation.name}
                          </p>
                          <span className="ml-2 text-sm font-bold text-green-600 dark:text-green-400">
                            ${donation.amount}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          <span>{donation.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePrayClick(donation.id)}
                      disabled={prayedFor[donation.id]}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                        prayedFor[donation.id]
                          ? isDarkMode
                            ? "bg-indigo-900 text-indigo-300"
                            : "bg-indigo-100 text-indigo-600"
                          : isDarkMode
                            ? "bg-gray-600 text-gray-300 hover:bg-indigo-900 hover:text-indigo-300"
                            : "bg-gray-200 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                      } transition-colors relative`}
                    >
                      <PrayingHands size={12} />
                      <span>{donation.prayerCount}</span>

                      {/* Sparkle animation */}
                      {showSparkle === donation.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute -top-2 -right-2"
                        >
                          <Sparkles className="text-yellow-400" size={16} />
                        </motion.div>
                      )}
                    </button>
                  </div>

                  <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{donation.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Hide webkit scrollbars with CSS */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>

        {/* Navigation arrows - always visible */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
          <button
            onClick={scrollUp}
            disabled={!canScrollUp || isLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              canScrollUp
                ? isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                : isDarkMode
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Show previous donations"
          >
            <ChevronUp size={20} />
          </button>
          <button
            onClick={scrollDown}
            disabled={!canScrollDown || isLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              canScrollDown
                ? isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                : isDarkMode
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Show more donations"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Donation counter */}
        {!isLoading && donations.length > 0 && (
          <div className="absolute bottom-2 right-3 text-xs text-gray-500 dark:text-gray-400">
            {visibleStartIndex + 1}-{Math.min(visibleEndIndex + 1, donations.length)} of {donations.length}
          </div>
        )}
      </div>

      {/* Update the modal to match the provided design */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-lg shadow-xl bg-white overflow-hidden relative"
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
            >
              <X size={18} />
            </button>

            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Pray</h2>

              {!messageSent ? (
                <>
                  <p className="text-gray-600 mb-2">Send an encouraging message or prayer to the campaign owner.</p>
                  <p className="text-gray-600 mb-6">Let them know you are praying for them.</p>

                  <p className="italic text-gray-700 mb-6">
                    The prayer of a righteous person is powerful and effective.{" "}
                    <span className="font-medium">James 5:16</span>
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">{error}</div>
                    )}

                    <div className="text-left">
                      <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={newPrayer.name}
                        onChange={(e) => setNewPrayer({ ...newPrayer, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="text-left">
                      <label htmlFor="prayer" className="block mb-1 text-sm font-medium text-gray-700">
                        Your Prayer
                      </label>
                      <textarea
                        id="prayer"
                        value={newPrayer.content}
                        onChange={(e) => setNewPrayer({ ...newPrayer, content: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Share your prayer with the campaign owner..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 bg-teal-500 text-white rounded-md text-sm font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Send Prayer"
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="bg-teal-500 text-white p-4 rounded-md flex items-center justify-center">
                  <Check className="mr-2" size={20} />
                  <span>Your prayer message has been sent.</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
