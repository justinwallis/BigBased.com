"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function AdminPage() {
  useEffect(() => {
    redirect("/api/payload/admin")
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Admin Panel...</h1>
        <p>
          If you are not redirected automatically,{" "}
          <a href="/api/payload/admin" className="text-blue-600 hover:underline">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  )
}
