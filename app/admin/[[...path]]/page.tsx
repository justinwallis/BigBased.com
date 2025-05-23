"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the Payload admin panel
    router.push("/api/payload/admin")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Admin Panel...</h1>
        <p>If you are not redirected automatically, click the button below:</p>
        <button
          onClick={() => (window.location.href = "/api/payload/admin")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Admin Panel
        </button>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
