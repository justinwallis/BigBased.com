"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-4 dark:text-white">Something went wrong</h1>
      <p className="mb-8 text-lg dark:text-gray-200">We apologize for the inconvenience. An error has occurred.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
