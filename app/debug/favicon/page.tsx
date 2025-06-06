import type { Metadata } from "next"

import DebugClient from "../components/debug-client"

export const metadata: Metadata = {
  title: "Favicon Debug | Big Based",
  description: "Debug favicon settings and display",
}

export default function FaviconDebugPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Favicon Debug</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Favicon Testing</h2>
        <p className="text-gray-600 dark:text-gray-300">Test favicon display and settings</p>
      </div>

      <div style={{ color: "white" }}>
        <h1 className="text-2xl font-bold mb-6">Favicon Debug</h1>

        <DebugClient />

        <div className="bg-black bg-opacity-30 p-4 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Favicon Files</h2>
          <ul className="space-y-2">
            <li>
              <a href="/favicon.ico" target="_blank" rel="noopener noreferrer" className="text-white underline">
                favicon.ico
              </a>
            </li>
            <li>
              <a href="/icon0.svg" target="_blank" rel="noopener noreferrer" className="text-white underline">
                icon0.svg
              </a>
            </li>
            <li>
              <a href="/icon1.png" target="_blank" rel="noopener noreferrer" className="text-white underline">
                icon1.png
              </a>
            </li>
            <li>
              <a href="/apple-icon.png" target="_blank" rel="noopener noreferrer" className="text-white underline">
                apple-icon.png
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-black bg-opacity-30 p-4 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Manifest Files</h2>
          <ul className="space-y-2">
            <li>
              <a href="/manifest.json" target="_blank" rel="noopener noreferrer" className="text-white underline">
                manifest.json
              </a>
            </li>
            <li>
              <a href="/site.webmanifest" target="_blank" rel="noopener noreferrer" className="text-white underline">
                site.webmanifest
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-black bg-opacity-30 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <ul className="space-y-2">
            <li>
              <a href="/debug" className="text-white underline">
                Back to Debug Home
              </a>
            </li>
            <li>
              <a href="/debug-static.html" className="text-white underline">
                View Static Debug Page
              </a>
            </li>
            <li>
              <a href="/" className="text-white underline">
                Return to Main Site
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
