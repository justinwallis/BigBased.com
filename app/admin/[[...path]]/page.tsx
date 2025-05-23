"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the Payload admin panel
    window.location.href = "/api/payload/admin"
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Loading Admin Panel...</h1>
        <p>You will be redirected to the Payload CMS admin panel shortly.</p>
        <div className="mt-4">
          <button
            onClick={() => (window.location.href = "/api/payload/admin")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Admin Panel
          </button>
        </div>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
