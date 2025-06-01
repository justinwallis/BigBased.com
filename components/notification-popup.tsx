"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, Check, Info, Shield, Clock } from "lucide-react"

interface NotificationPopupProps {
  show: boolean
  onSubscribe: () => void
  onClose: () => void
}

export function NotificationPopup({ show, onSubscribe, onClose }: NotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Control visibility with animation
  useEffect(() => {
    if (show) {
      setIsVisible(true)
    }
  }, [show])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300) // Wait for exit animation to complete
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-2 mr-3">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-white font-bold text-lg">Stay Updated</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close notification popup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Get real-time updates on new content, important announcements, and exclusive offers from BigBased.
              </p>

              {/* Benefits */}
              <div className="space-y-2 mb-5">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Be the first to know about new resources and tools
                  </p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive alerts about important campaign updates
                  </p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified about exclusive content and events
                  </p>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-5 px-1">
                <div className="flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Unsubscribe anytime</span>
                </div>
                <div className="flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  <span>No spam</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onSubscribe}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Enable Notifications
                </motion.button>
                <button
                  onClick={handleClose}
                  className="flex-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Keep the default export for backward compatibility
export default NotificationPopup
