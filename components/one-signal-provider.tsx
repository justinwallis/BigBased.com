"use client"

import { useState, useEffect, useRef, createContext, useContext } from "react"
import Script from "next/script"
import NotificationPopup from "@/components/notification-popup"

// Create context for OneSignal
interface OneSignalContextType {
  isInitialized: boolean
  isSubscribed: boolean
  showPopup: () => void
}

const OneSignalContext = createContext<OneSignalContextType>({
  isInitialized: false,
  isSubscribed: false,
  showPopup: () => {},
})

export const useOneSignal = () => useContext(OneSignalContext)

export default function OneSignalProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  const [hasShownPopup, setHasShownPopup] = useState(false)
  const [scrollThresholdReached, setScrollThresholdReached] = useState(false)
  const timeoutRef = useRef(null)
  const oneSignalInitialized = useRef(false)

  // Function to check if user is subscribed
  const checkSubscriptionStatus = async () => {
    try {
      if (window.OneSignal && oneSignalInitialized.current) {
        const subscriptionState = await window.OneSignal.getSubscriptionState()
        setIsSubscribed(subscriptionState.subscribed)
        return subscriptionState.subscribed
      }
      return false
    } catch (error) {
      console.error("Error checking subscription status:", error)
      return false
    }
  }

  // Initialize OneSignal
  useEffect(() => {
    if (typeof window !== "undefined" && !oneSignalInitialized.current) {
      window.OneSignalDeferred = window.OneSignalDeferred || []

      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          await OneSignal.init({
            appId: "0523f056-16d9-4cff-a865-553cb542b747",
            safari_web_id: "web.onesignal.auto.579431ec-451c-467f-a977-87d9f3b6152b",
            notifyButton: {
              enable: false, // We'll use our custom UI
            },
            allowLocalhostAsSecureOrigin: true,
          })

          oneSignalInitialized.current = true
          setIsInitialized(true)

          // Check subscription status after initialization
          const isUserSubscribed = await checkSubscriptionStatus()

          // If not subscribed and hasn't shown popup, show it after a delay
          if (!isUserSubscribed && !hasShownPopup) {
            timeoutRef.current = setTimeout(() => {
              setShowNotificationPopup(true)
              setHasShownPopup(true)
            }, 15000) // 15 seconds
          }
        } catch (error) {
          console.error("Error initializing OneSignal:", error)
        }
      })
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [hasShownPopup])

  // Check subscription status periodically
  useEffect(() => {
    if (isInitialized) {
      const checkInterval = setInterval(checkSubscriptionStatus, 30000) // Check every 30 seconds
      return () => clearInterval(checkInterval)
    }
  }, [isInitialized])

  // Add scroll listener to show popup when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollThresholdReached && !hasShownPopup && !isSubscribed) {
        const scrollY = window.scrollY
        const threshold = document.documentElement.scrollHeight * 0.15 // 15% of page height

        if (scrollY > threshold) {
          setScrollThresholdReached(true)
          setShowNotificationPopup(true)
          setHasShownPopup(true)

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrollThresholdReached, hasShownPopup, isSubscribed])

  // Function to show popup manually
  const showPopup = () => {
    setShowNotificationPopup(true)
  }

  return (
    <OneSignalContext.Provider value={{ isInitialized, isSubscribed, showPopup }}>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="afterInteractive"
        onLoad={() => console.log("OneSignal script loaded")}
      />

      {children}

      {showNotificationPopup && (
        <NotificationPopup
          onClose={() => setShowNotificationPopup(false)}
          onSubscribe={async () => {
            try {
              if (window.OneSignal) {
                await window.OneSignal.showNativePrompt()
                // Check status after a short delay to allow browser to update
                setTimeout(async () => {
                  const isUserSubscribed = await checkSubscriptionStatus()
                  if (isUserSubscribed) {
                    setShowNotificationPopup(false)
                  }
                }, 1000)
              }
            } catch (error) {
              console.error("Error showing native prompt:", error)
            }
          }}
        />
      )}
    </OneSignalContext.Provider>
  )
}
