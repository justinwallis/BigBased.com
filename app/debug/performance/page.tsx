"use client"

import { useState, useEffect } from "react"

export default function PerformanceDebugPage() {
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Performance Debug</h1>

      {!performanceData ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Loading performance data...</p>
        </div>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Navigation Timing</h2>
            <div className="bg-white p-4 rounded shadow overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Metric</th>
                    <th className="text-left py-2 px-4">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">DNS Lookup</td>
                    <td className="py-2 px-4">
                      {formatTime(
                        performanceData.navigationTiming.domainLookupEnd -
                          performanceData.navigationTiming.domainLookupStart,
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">TCP Connection</td>
                    <td className="py-2 px-4">
                      {formatTime(
                        performanceData.navigationTiming.connectEnd - performanceData.navigationTiming.connectStart,
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">TLS Negotiation</td>
                    <td className="py-2 px-4">
                      {performanceData.navigationTiming.secureConnectionStart
                        ? formatTime(
                            performanceData.navigationTiming.connectEnd -
                              performanceData.navigationTiming.secureConnectionStart,
                          )
                        : "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Time to First Byte</td>
                    <td className="py-2 px-4">
                      {formatTime(
                        performanceData.navigationTiming.responseStart - performanceData.navigationTiming.requestStart,
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Content Download</td>
                    <td className="py-2 px-4">
                      {formatTime(
                        performanceData.navigationTiming.responseEnd - performanceData.navigationTiming.responseStart,
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">DOM Processing</td>
                    <td className="py-2 px-4">
                      {formatTime(
                        performanceData.navigationTiming.domComplete - performanceData.navigationTiming.domInteractive,
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">DOM Content Loaded</td>
                    <td className="py-2 px-4">
                      {formatTime(
                        performanceData.navigationTiming.domContentLoadedEventEnd -
                          performanceData.navigationTiming.navigationStart,
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Page Load Complete</td>
                    <td className="py-2 px-4">
                      {formatTime(
                        performanceData.navigationTiming.loadEventEnd -
                          performanceData.navigationTiming.navigationStart,
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Resource Timing (Top 10)</h2>
            <div className="bg-white p-4 rounded shadow overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Resource</th>
                    <th className="text-left py-2 px-4">Type</th>
                    <th className="text-left py-2 px-4">Size</th>
                    <th className="text-left py-2 px-4">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.resourceTiming.map((entry: any, index: number) => {
                    const url = new URL(entry.name)
                    const pathname = url.pathname
                    const filename = pathname.split("/").pop()
                    const fileType = pathname.split(".").pop()

                    return (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4 max-w-xs truncate" title={entry.name}>
                          {filename || entry.name}
                        </td>
                        <td className="py-2 px-4">{fileType || "unknown"}</td>
                        <td className="py-2 px-4">{entry.transferSize ? formatSize(entry.transferSize) : "N/A"}</td>
                        <td className="py-2 px-4">{formatTime(entry.duration)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Memory Usage</h2>
              <div className="bg-white p-4 rounded shadow">
                <table className="min-w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4">JS Heap Size Limit</td>
                      <td className="py-2 px-4">
                        {typeof performanceData.memoryInfo.jsHeapSizeLimit === "number"
                          ? formatSize(performanceData.memoryInfo.jsHeapSizeLimit)
                          : performanceData.memoryInfo.jsHeapSizeLimit}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Total JS Heap Size</td>
                      <td className="py-2 px-4">
                        {typeof performanceData.memoryInfo.totalJSHeapSize === "number"
                          ? formatSize(performanceData.memoryInfo.totalJSHeapSize)
                          : performanceData.memoryInfo.totalJSHeapSize}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">Used JS Heap Size</td>
                      <td className="py-2 px-4">
                        {typeof performanceData.memoryInfo.usedJSHeapSize === "number"
                          ? formatSize(performanceData.memoryInfo.usedJSHeapSize)
                          : performanceData.memoryInfo.usedJSHeapSize}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Network Information</h2>
              <div className="bg-white p-4 rounded shadow">
                <table className="min-w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4">Effective Connection Type</td>
                      <td className="py-2 px-4">{performanceData.connectionInfo.effectiveType}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Downlink</td>
                      <td className="py-2 px-4">
                        {typeof performanceData.connectionInfo.downlink === "number"
                          ? `${performanceData.connectionInfo.downlink} Mbps`
                          : performanceData.connectionInfo.downlink}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Round Trip Time</td>
                      <td className="py-2 px-4">
                        {typeof performanceData.connectionInfo.rtt === "number"
                          ? `${performanceData.connectionInfo.rtt} ms`
                          : performanceData.connectionInfo.rtt}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">Save Data Mode</td>
                      <td className="py-2 px-4">{performanceData.connectionInfo.saveData.toString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-4">Performance Recommendations</h2>
            <div className="bg-white p-4 rounded shadow">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-2">
                    i
                  </span>
                  <div>
                    <p className="font-medium">Implement code splitting</p>
                    <p className="text-sm text-gray-600">
                      Break down large JavaScript bundles to improve initial load time.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-2">
                    i
                  </span>
                  <div>
                    <p className="font-medium">Optimize images further</p>
                    <p className="text-sm text-gray-600">
                      Consider using WebP format and implementing lazy loading for below-the-fold images.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-2">
                    i
                  </span>
                  <div>
                    <p className="font-medium">Implement resource hints</p>
                    <p className="text-sm text-gray-600">
                      Use preconnect for third-party domains and preload for critical resources.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
