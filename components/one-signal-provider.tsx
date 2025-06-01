"use client"

import type React from "react"
import { useEffect } from "react"

const OneSignalProvider: React.FC = ({ children }) => {
  useEffect(() => {
    try {
      // Existing OneSignal initialization code
      window.OneSignal = window.OneSignal || []
      OneSignal.push(() => {
        OneSignal.init({
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

export default OneSignalProvider
