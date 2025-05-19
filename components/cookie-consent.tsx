"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookie-consent")
    if (!hasAccepted) {
      // Small delay to prevent the banner from flashing on page load
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 py-1 px-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-md">
      <div className="container mx-auto flex flex-row items-center justify-between">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <strong>Essential Cookies Only:</strong> We use cookies solely for critical site functionality.
        </p>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          <button
            onClick={acceptCookies}
            className="text-xs py-0.5 px-2 rounded bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={acceptCookies}
            className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white"
            aria-label="Close cookie notice"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
