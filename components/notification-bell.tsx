"use client"

import { Bell } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface NotificationBellProps {
  onClick: () => void
  isSubscribed: boolean
  variant?: "fixed" | "inline" | "menu"
  className?: string
}

export default function NotificationBell({
  onClick,
  isSubscribed,
  variant = "fixed",
  className = "",
}: NotificationBellProps) {
  const [showPulse, setShowPulse] = useState(false)

  // Add a pulsing effect to draw attention to the bell
  useEffect(() => {
    if (!isSubscribed && variant === "fixed") {
      // Start pulsing after 10 seconds if not subscribed
      const timeout = setTimeout(() => {
        setShowPulse(true)
      }, 10000)

      return () => clearTimeout(timeout)
    }
  }, [isSubscribed, variant])

  // Different styles based on variant
  const getContainerStyles = () => {
    switch (variant) {
      case "fixed":
        return "fixed top-20 right-4 z-40 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
      case "inline":
        return `inline-flex items-center justify-center rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`
      case "menu":
        return `flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-md ${className}`
      default:
        return ""
    }
  }

  return (
    <motion.button
      onClick={onClick}
      className={getContainerStyles()}
      whileHover={{ scale: variant === "fixed" ? 1.1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Notification settings"
      title="Notification settings"
    >
      <div className="relative">
        <Bell className={`${variant === "menu" ? "h-4 w-4 mr-2" : "h-5 w-5"} text-gray-700 dark:text-gray-300`} />

        {isSubscribed && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-800" />
        )}

        {showPulse && !isSubscribed && variant === "fixed" && (
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        )}
      </div>

      {variant === "menu" && <span className="text-sm">Notifications</span>}
    </motion.button>
  )
}
