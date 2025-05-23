"use client"

import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load the Payload admin UI
    const script = document.createElement("script")
    script.src = "/api/payload-admin.js"
    script.async = true
    script.onload = () => setIsLoading(false)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return <div id="payload-admin" className="h-screen w-full" />
}
