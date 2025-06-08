"use client"

import * as Sentry from "@sentry/nextjs"
import type Error from "next/error"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
              <p className="text-gray-600 mb-6">
                We apologize for the inconvenience. An error has occurred and has been reported to our team.
              </p>
              <div className="space-y-3">
                <button
                  onClick={reset}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Try again
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
