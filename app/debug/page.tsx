"use client"

import { useState, useEffect } from "react"

export default function MasterDebugPage() {
  const [systemInfo, setSystemInfo] = useState<{
    userAgent: string
    screenSize: string
    viewportSize: string
    devicePixelRatio: number
    colorScheme: string
    timeZone: string
    language: string
    online: boolean
  } | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      setSystemInfo({
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio,
        colorScheme: mediaQuery.matches ? "dark" : "light",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        online: navigator.onLine,
      })
    }
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Master Debug</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Debug Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/debug/favicon" className="block bg-white p-6 rounded shadow hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2">Favicon Debug</h3>
            <p className="text-gray-600 text-sm">Inspect all favicon assets and manifest files</p>
          </a>
          <a href="/debug/images" className="block bg-white p-6 rounded shadow hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2">Image Debug</h3>
            <p className="text-gray-600 text-sm">Analyze image usage and optimization</p>
          </a>
          <a href="/debug/performance" className="block bg-white p-6 rounded shadow hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2">Performance</h3>
            <p className="text-gray-600 text-sm">View detailed performance metrics</p>
          </a>
        </div>
      </section>

      {systemInfo && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">System Information</h2>
          <div className="bg-white p-4 rounded shadow">
            <table className="min-w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">User Agent</td>
                  <td className="py-2 px-4 break-all">{systemInfo.userAgent}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Screen Size</td>
                  <td className="py-2 px-4">{systemInfo.screenSize}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Viewport Size</td>
                  <td className="py-2 px-4">{systemInfo.viewportSize}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Device Pixel Ratio</td>
                  <td className="py-2 px-4">{systemInfo.devicePixelRatio}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Color Scheme Preference</td>
                  <td className="py-2 px-4">{systemInfo.colorScheme}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Time Zone</td>
                  <td className="py-2 px-4">{systemInfo.timeZone}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Language</td>
                  <td className="py-2 px-4">{systemInfo.language}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium">Online Status</td>
                  <td className="py-2 px-4">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${systemInfo.online ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                    {systemInfo.online ? "Online" : "Offline"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm mb-2">Public environment variables:</p>
          <pre className="bg-gray-100 p-2 overflow-auto text-xs rounded">
            {`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set"}
NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "********" : "Not set"}
NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL || "Not set"}`}
          </pre>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Local Storage</h2>
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between mb-2">
            <p className="text-sm">Local storage items:</p>
            <button
              className="text-xs text-blue-600 hover:underline"
              onClick={() => {
                if (typeof window !== "undefined") {
                  const storageItems = { ...localStorage }
                  console.log("Local Storage Items:", storageItems)
                  alert("Local storage items logged to console")
                }
              }}
            >
              Log to console
            </button>
          </div>
          <div className="bg-gray-100 p-2 rounded">
            <div id="localStorage-items" className="text-xs font-mono">
              {typeof window !== "undefined" && (
                <ul>
                  {Object.keys(localStorage).length === 0 ? (
                    <li className="py-1">No items in local storage</li>
                  ) : (
                    Object.keys(localStorage).map((key) => (
                      <li key={key} className="py-1">
                        <span className="font-semibold">{key}:</span>{" "}
                        <span className="truncate inline-block max-w-xs">
                          {localStorage.getItem(key)?.length > 50
                            ? localStorage.getItem(key)?.substring(0, 50) + "..."
                            : localStorage.getItem(key)}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
