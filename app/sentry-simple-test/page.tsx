"use client"

import { useState } from "react"
import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"

export default function SentrySimpleTest() {
  const [result, setResult] = useState<string | null>(null)

  const testSentry = () => {
    try {
      console.log("Testing Sentry...")

      // Log the DSN to verify it's available
      console.log("DSN:", process.env.NEXT_PUBLIC_SENTRY_DSN)

      // Send a test message
      const eventId = Sentry.captureMessage("Test message from simple test page")
      console.log("Event sent with ID:", eventId)

      setResult(`Event sent with ID: ${eventId}`)

      // Also try a real error
      setTimeout(() => {
        try {
          // This will cause a real error
          const obj: any = null
          obj.nonExistentMethod()
        } catch (e) {
          console.error("Caught error:", e)
          if (e instanceof Error) {
            Sentry.captureException(e)
            console.log("Exception captured")
          }
        }
      }, 1000)
    } catch (e) {
      console.error("Error in testSentry:", e)
      setResult(`Error: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Simple Sentry Test</h1>

      <div className="space-y-6">
        <Button onClick={testSentry}>Test Sentry</Button>

        {result && (
          <div className="p-4 bg-gray-100 rounded-md">
            <p>{result}</p>
          </div>
        )}

        <div className="p-4 bg-gray-100 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click the "Test Sentry" button above</li>
            <li>Check your browser console for logs</li>
            <li>Check your Sentry dashboard for new events</li>
            <li>If no events appear, try refreshing your Sentry dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
