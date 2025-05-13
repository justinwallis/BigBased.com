"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import loadingManager from "@/utils/loading-manager"
import { preloadImages } from "@/utils/image-preloader"
import { errorLogger } from "@/utils/error-logger"

interface PreloaderProps {
  minimumLoadingTime?: number
  /**
   * Number of quotes to randomly select from the pool
   * If not provided, all quotes will be used
   * If set to 0, no quotes will be displayed
   */
  quotesToShow?: number
  /**
   * Callback function to be called when preloader is complete
   */
  onComplete?: () => void
}

// Full list of loading messages
const allLoadingMessages = [
  "Reclaiming digital sovereignty...",
  "Preserving truth in a world of deception...",
  "Building a parallel economy...",
  "Connecting freedom-minded individuals...",
  "Restoring faith in our institutions...",
  "Empowering the next generation...",
  "Defending constitutional rights...",
  "Advancing individual liberty...",
  "Cultivating a culture of responsibility...",
  "Dismantling cultural decay...",
  "Archiving censored knowledge...",
  "Forging a path to freedom...",
]

// Animation variations
const animationVariants = [
  {
    name: "fade",
    logo: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    },
    text: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
    },
  },
  {
    name: "slide",
    logo: {
      initial: { x: -50, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    },
    text: {
      initial: { x: 50, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } },
    },
  },
  {
    name: "scale",
    logo: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1, transition: { duration: 0.5, type: "spring", stiffness: 200 } },
    },
    text: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1, transition: { duration: 0.5, delay: 0.3, type: "spring", stiffness: 150 } },
    },
  },
  {
    name: "reveal",
    logo: {
      initial: { y: -20, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: { duration: 0.4 } },
    },
    text: {
      initial: { clipPath: "inset(0 100% 0 0)", opacity: 0.3 },
      animate: {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        transition: { duration: 0.6, delay: 0.4, ease: "easeOut" },
      },
    },
  },
]

/**
 * Fisher-Yates (Knuth) shuffle algorithm
 * Efficiently shuffles an array in-place with O(n) time complexity
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Preloader({ minimumLoadingTime = 2500, quotesToShow, onComplete }: PreloaderProps) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageVisible, setMessageVisible] = useState(true)
  const [selectedAnimation, setSelectedAnimation] = useState(0)
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [resourcesLoaded, setResourcesLoaded] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const messageIndexRef = useRef(0)
  const startTimeRef = useRef(Date.now())
  const hasCalledOnCompleteRef = useRef(false)

  // Select random animation and messages on mount
  useEffect(() => {
    try {
      // Select random animation
      const randomAnimationIndex = Math.floor(Math.random() * animationVariants.length)
      setSelectedAnimation(randomAnimationIndex)

      // Determine how many quotes to select
      let messagesToSelect: string[]

      if (quotesToShow === 0) {
        // If quotesToShow is explicitly set to 0, don't show any quotes
        messagesToSelect = []
      } else if (quotesToShow === undefined || quotesToShow >= allLoadingMessages.length) {
        // If quotesToShow is undefined or greater than available quotes, use all quotes
        messagesToSelect = shuffleArray(allLoadingMessages)
      } else {
        // Otherwise, select the specified number of quotes
        messagesToSelect = shuffleArray(allLoadingMessages).slice(0, quotesToShow)
      }

      setSelectedMessages(messagesToSelect)

      // Set initial message if we have any
      if (messagesToSelect.length > 0) {
        setCurrentMessage(messagesToSelect[0])
      }

      // Register the animation as a resource
      loadingManager.registerResource("preloader-animation", 1)
      loadingManager.startLoading("preloader-animation")

      // Start the minimum loading time timer
      const timer = setTimeout(() => {
        setAnimationComplete(true)
        loadingManager.resourceLoaded("preloader-animation")
      }, minimumLoadingTime)

      return () => {
        clearTimeout(timer)
      }
    } catch (error) {
      errorLogger.logError(error instanceof Error ? error : new Error(String(error)), {
        component: "Preloader",
        function: "initialization",
      })
      // Ensure we still set animation complete to not block loading
      setAnimationComplete(true)
    }
  }, [minimumLoadingTime, quotesToShow])

  // Handle message rotation
  useEffect(() => {
    // Skip if no messages or only one message
    if (selectedMessages.length <= 1) return

    try {
      // Setup message rotation
      const rotateMessages = () => {
        setMessageVisible(false)

        // After fade out, change message and fade in
        setTimeout(() => {
          messageIndexRef.current = (messageIndexRef.current + 1) % selectedMessages.length
          setCurrentMessage(selectedMessages[messageIndexRef.current])
          setMessageVisible(true)
        }, 500) // Half a second for fade out/in
      }

      // Start message rotation after a delay
      const initialDelay = setTimeout(() => {
        messageIntervalRef.current = setInterval(rotateMessages, 3000) // Change message every 3 seconds
      }, 1000) // Start after 1 second

      return () => {
        clearTimeout(initialDelay)
        if (messageIntervalRef.current) clearInterval(messageIntervalRef.current)
      }
    } catch (error) {
      errorLogger.logError(error instanceof Error ? error : new Error(String(error)), {
        component: "Preloader",
        function: "messageRotation",
      })
    }
  }, [selectedMessages])

  // Preload key images safely
  useEffect(() => {
    const preloadKeyImages = async () => {
      try {
        loadingManager.registerResource("key-images", 2)
        loadingManager.startLoading("key-images")

        // List of key images to preload
        const imagesToPreload = [
          "/american-flag.png",
          "/dove-spread-wings.png",
          "/cultural-decay.png",
          "/digital-sovereignty.png",
          "/truth-archives.png",
          "/parallel-economy.png",
          "/generic-organization-logo.png",
          "/generic-company-logo.png",
          "/generic-college-logo.png",
        ]

        // Safely preload images
        await preloadImages(imagesToPreload)

        // Mark images as loaded
        loadingManager.resourceLoaded("key-images")
      } catch (error) {
        errorLogger.logError(error instanceof Error ? error : new Error(String(error)), {
          component: "Preloader",
          function: "preloadKeyImages",
        })
        // Still mark as loaded to not block the preloader
        loadingManager.resourceLoaded("key-images")
      }
    }

    preloadKeyImages()
  }, [])

  // Listen to loading manager progress
  useEffect(() => {
    try {
      const unsubscribe = loadingManager.onProgress((managerProgress) => {
        setProgress(managerProgress)
      })

      const completeUnsubscribe = loadingManager.onComplete(() => {
        setResourcesLoaded(true)
      })

      return () => {
        unsubscribe()
        completeUnsubscribe()
      }
    } catch (error) {
      errorLogger.logError(error instanceof Error ? error : new Error(String(error)), {
        component: "Preloader",
        function: "loadingManagerListener",
      })
      // Ensure we don't block loading
      setResourcesLoaded(true)
    }
  }, [])

  // Determine when to hide the preloader
  useEffect(() => {
    if (resourcesLoaded && animationComplete) {
      try {
        // Both actual resources and animation are complete
        const totalLoadTime = Date.now() - startTimeRef.current
        console.log(`Total load time: ${totalLoadTime}ms`)

        // Add a small delay for a smooth transition
        setTimeout(() => {
          setLoading(false)

          // Clean up any intervals
          if (messageIntervalRef.current) clearInterval(messageIntervalRef.current)
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

          // Call onComplete callback if provided
          if (onComplete && !hasCalledOnCompleteRef.current) {
            hasCalledOnCompleteRef.current = true
            onComplete()
          }
        }, 300)
      } catch (error) {
        errorLogger.logError(error instanceof Error ? error : new Error(String(error)), {
          component: "Preloader",
          function: "hidePreloader",
        })
        // Ensure we still hide the preloader
        setLoading(false)

        // Still call onComplete even if there's an error
        if (onComplete && !hasCalledOnCompleteRef.current) {
          hasCalledOnCompleteRef.current = true
          onComplete()
        }
      }
    }
  }, [resourcesLoaded, animationComplete, onComplete])

  // Get the selected animation variant
  const selectedVariant = animationVariants[selectedAnimation]

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: "easeInOut",
            },
          }}
        >
          <div className="relative">
            {/* Binary code background animation */}
            <div className="absolute -inset-20 opacity-10 select-none pointer-events-none overflow-hidden">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="binary-row"
                  style={{
                    top: `${i * 10}%`,
                    left: `${i % 2 === 0 ? -50 : 0}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {Array.from({ length: 20 }).map((_, j) => (
                    <span
                      key={j}
                      className="inline-block mx-1 text-black opacity-50"
                      style={{ animationDelay: `${j * 0.05}s` }}
                    >
                      {Math.random() > 0.5 ? "1" : "0"}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Logo animation - Fixed height container to prevent jumping */}
            <div className="relative z-10">
              <motion.div
                className="flex flex-col items-center w-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Fixed height container for logo to prevent layout shifts */}
                <div className="h-16 flex items-center justify-center mb-4">
                  <motion.div
                    className="bg-black text-white px-6 py-3 text-4xl font-bold"
                    initial={selectedVariant.logo.initial}
                    animate={selectedVariant.logo.animate}
                  >
                    BB
                  </motion.div>
                </div>

                {/* Fixed height container for tagline to prevent layout shifts */}
                <div className="h-8 flex items-center justify-center mb-6">
                  <motion.div
                    className="text-lg font-medium text-center"
                    initial={selectedVariant.text.initial}
                    animate={selectedVariant.text.animate}
                  >
                    BIG BASED
                  </motion.div>
                </div>

                {/* Fixed height container for loading message to prevent layout shifts */}
                <div className="h-12 flex items-center justify-center mb-4">
                  {selectedMessages.length > 0 && (
                    <motion.div
                      className="text-center text-gray-600 italic text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4, duration: 0.5 }}
                    >
                      <motion.p animate={{ opacity: messageVisible ? 1 : 0 }} transition={{ duration: 0.5 }}>
                        {currentMessage}
                      </motion.p>
                    </motion.div>
                  )}
                </div>

                {/* Loading indicator with percentage */}
                <motion.div
                  className="relative h-1 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  {/* Percentage display */}
                  <motion.div
                    className="absolute -top-6 right-0 text-sm font-bold text-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.3 }}
                  >
                    {progress}%
                  </motion.div>

                  {/* Progress bar */}
                  <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-black"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
