"use client"

import { useState, useEffect } from "react"

export default function ImageDebugPage() {
  const [imageStats, setImageStats] = useState<{
    totalImages: number
    totalSize: number
    largestImage: { path: string; size: number } | null
    imagesByType: Record<string, number>
  }>({
    totalImages: 0,
    totalSize: 0,
    largestImage: null,
    imagesByType: {},
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // This is a mock implementation since we can't actually scan the file system in the browser
    // In a real implementation, this would be a server-side API call
    setTimeout(() => {
      try {
        // Mock data
        setImageStats({
          totalImages: 42,
          totalSize: 4823000, // 4.8MB
          largestImage: { path: "/abstract-digital-landscape.png", size: 820000 }, // 820KB
          imagesByType: {
            png: 38,
            jpg: 2,
            svg: 1,
            gif: 1,
          },
        })
        setLoading(false)
      } catch (err) {
        setError("Failed to load image statistics")
        setLoading(false)
      }
    }, 1000)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Image Debug</h1>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Loading image statistics...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Image Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm text-gray-500">Total Images</h3>
                <p className="text-2xl font-bold">{imageStats.totalImages}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm text-gray-500">Total Size</h3>
                <p className="text-2xl font-bold">{(imageStats.totalSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm text-gray-500">Largest Image</h3>
                <p className="text-lg font-bold">{(imageStats.largestImage?.size || 0 / 1024).toFixed(0)} KB</p>
                <p className="text-xs truncate">{imageStats.largestImage?.path}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm text-gray-500">Image Types</h3>
                <div>
                  {Object.entries(imageStats.imagesByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span className="text-sm">.{type}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Critical Images</h2>
            <div className="bg-white p-4 rounded shadow">
              <p className="mb-2 text-sm">These images are preloaded for optimal performance:</p>
              <ul className="list-disc pl-5 text-sm">
                <li>/bb-logo.png</li>
                <li>/dove-cross.png</li>
                <li>/american-flag.png</li>
                <li>/digital-sovereignty.png</li>
                <li>/cultural-decay.png</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Image Optimization Recommendations</h2>
            <div className="bg-white p-4 rounded shadow">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 text-yellow-800 mr-2">
                    !
                  </span>
                  <div>
                    <p className="font-medium">Compress large images</p>
                    <p className="text-sm text-gray-600">
                      Several PNG images are over 500KB and could be compressed further.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 mr-2">
                    ✓
                  </span>
                  <div>
                    <p className="font-medium">Good use of next/image</p>
                    <p className="text-sm text-gray-600">
                      Most images are using the Next.js Image component correctly.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-2">
                    i
                  </span>
                  <div>
                    <p className="font-medium">Consider WebP format</p>
                    <p className="text-sm text-gray-600">
                      Convert PNG images to WebP to reduce file size by approximately 30%.
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
