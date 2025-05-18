"use client"

import { useEffect, useState } from "react"
import PreloaderRemover from "./preloader-remover"

export default function DebugClient() {
  const [systemInfo, setSystemInfo] = useState<Record<string, any>>({})

  useEffect(() => {
    // Collect system information
    setSystemInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      colorDepth: window.screen.colorDepth,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      online: navigator.onLine,
      doNotTrack: navigator.doNotTrack,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString(),
    })
  }, [])

  return (
    <>
      <PreloaderRemover />

      <div className="bg-black bg-opacity-30 p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(systemInfo).map(([key, value]) => (
            <div key={key} className="flex">
              <div className="font-medium mr-2">{key}:</div>
              <div>{String(value)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
