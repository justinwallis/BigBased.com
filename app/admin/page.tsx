"use client"

import { useEffect } from "react"

export default function AdminPage() {
  useEffect(() => {
    // Redirect to the Payload admin via the API route
    window.location.href = "/api/payload"
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg">Redirecting to admin panel...</p>
      </div>
    </div>
  )
}
