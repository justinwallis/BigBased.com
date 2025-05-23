"use client"

import { useEffect } from "react"

export default function AdminPage() {
  useEffect(() => {
    // Redirect to the Payload admin
    window.location.href = "/api/payload/admin"
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Admin...</h1>
        <p>
          If you are not redirected automatically,{" "}
          <a href="/api/payload/admin" className="text-blue-600 underline">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  )
}
