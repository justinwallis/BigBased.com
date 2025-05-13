"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import InteractiveSitemap from "./interactive-sitemap"

// Create a custom event for toggling the sitemap
export const toggleSitemapEvent = "toggle-sitemap"

export default function SitemapContainer() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Listen for the custom event to toggle the sitemap
    const handleToggleSitemap = () => {
      setIsOpen((prev) => !prev)
    }

    window.addEventListener(toggleSitemapEvent, handleToggleSitemap)

    return () => {
      window.removeEventListener(toggleSitemapEvent, handleToggleSitemap)
    }
  }, [])

  return (
    <>
      {/* Modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            {/* Modal content */}
            <motion.div
              key="sitemap-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <div className="sticky top-0 z-10 flex justify-end p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close sitemap"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sitemap content */}
              <div className="p-4">
                <InteractiveSitemap />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
