"use client"

import { useState, useEffect } from "react"

export default function PerformanceDebugClientPage() {
  const [performanceData, setPerformanceData] = useState<{
    navigationTiming: any
    resourceTiming: any[]
    memoryInfo: any
    connectionInfo: any
  } | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get navigation timing data
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

      // Get resource timing data
      const resourceEntries = performance
        .getEntriesByType("resource")
        .filter((entry) => {
          const url = (entry as PerformanceResourceTiming).name
          return (
            url.includes(".js") ||
            url.includes(".css") ||
            url.includes(".png") ||
            url.includes(".jpg") ||
            url.includes(".svg")
          )
        })
        .slice(0, 10) // Limit to 10 entries for brevity

      // Get memory info if available
      const memoryInfo = (performance as any).memory || {
        jsHeapSizeLimit: "Not available",
        totalJSHeapSize: "Not available",
        usedJSHeapSize: "Not available",
      }

      // Get connection info if available
      const connectionInfo = (navigator as any).connection || {
        effectiveType: "Not available",
        downlink: "Not available",
        rtt: "Not available",
        saveData: "Not available",
      }

      setPerformanceData({
        navigationTiming: navEntry,
        resourceTiming: resourceEntries,
        memoryInfo,
        connectionInfo,
      })
    }
  }, [])

  const formatTime = (timeInMs: number) => {
    return `${timeInMs.toFixed(2)}ms`
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Performance Debug</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Performance Testing</h2>
        <p className="text-gray-600 dark:text-gray-300">Test performance metrics and optimizations</p>
      </div>
    </div>
  )
}
