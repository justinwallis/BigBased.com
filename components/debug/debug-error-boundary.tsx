"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function DebugErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Error caught by DebugErrorBoundary:", event.error)
      setError(event.error)
      setHasError(true)
      event.preventDefault()
    }

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error("Promise rejection caught by DebugErrorBoundary:", event.reason)
      setError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)))
      setHasError(true)
      event.preventDefault()
    }

    window.addEventListener("error", errorHandler)
    window.addEventListener("unhandledrejection", rejectionHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
      window.removeEventListener("unhandledrejection", rejectionHandler)
    }
  }, [])

  if (hasError) {
    return (
      <div className="p-8 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-xl font-bold text-red-700 mb-4">Debug Tool Error</h2>
        <p className="text-red-600 mb-4">There was an error in the debugging interface.</p>
        <pre className="bg-white p-4 rounded overflow-auto max-h-[300px] text-sm">
          {error?.message || "Unknown error"}
        </pre>
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => {
              setHasError(false)
              setError(null)
            }}
            className="text-blue-600 hover:underline"
          >
            Try again
          </button>
          <Link href="/debug" className="text-blue-600 hover:underline">
            Return to debug home
          </Link>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
