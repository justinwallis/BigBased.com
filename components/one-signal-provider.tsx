"use client"

import type React from "react"
import { useEffect } from "react"

interface OneSignalProviderProps {
  children: React.ReactNode
}

declare global {
  interface Window {
    OneSignal: any
  }
}

export function OneSignalProvider({ children }: OneSignalProviderProps) {
  useEffect(() => {
    try {
      // Existing OneSignal initialization code
      window.OneSignal = window.OneSignal || []
      window.OneSignal.push(() => {
        window.OneSignal.init({
          appId: "YOUR_ONESIGNAL_APP_ID",
          safari_web_id: "YOUR_SAFARI_WEB_ID",
          notifyButton: {
            enable: true,
          },
        })
      })
    } catch (error) {
      console.warn("Error initializing OneSignal:", error)
    }

    try {
      if (window.OneSignal && typeof window.OneSignal.getSubscriptionState === "function") {
        window.OneSignal.getSubscriptionState().then((state) => {
          // Existing subscription state handling
        })
      }
    } catch (error) {
      console.warn("Error checking OneSignal subscription:", error)
    }
  }, [])

  return <>{children}</>
}

// Named export
export { OneSignalProvider as default }
