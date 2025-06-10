"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle } from "lucide-react"

export default function SentryExamplePage() {
  const [errorTriggered, setErrorTriggered] = useState(false)
  const [success, setSuccess] = useState(false)

  const triggerError = () => {
    try {
      // This will cause an error
      const myUndefinedFunction = (null as any).myFunction
      myUndefinedFunction()
    } catch (error) {
      console.error("Error triggered for Sentry:", error)
      setErrorTriggered(true)

      // Check if Sentry is loaded
      if (window.Sentry) {
        window.Sentry.captureException(error)
        setSuccess(true)
      }
    }
  }

  const triggerPromiseError = () => {
    // This creates an unhandled promise rejection
    new Promise((_, reject) => {
      reject(new Error("This is a test promise rejection for Sentry"))
    })
    setErrorTriggered(true)
  }

  const triggerConsoleError = () => {
    console.error("This is a test console error for Sentry")
    setErrorTriggered(true)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Sentry Integration Test</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Sentry Integration</CardTitle>
            <CardDescription>
              Click the buttons below to trigger different types of errors that Sentry should capture.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={triggerError} variant="destructive">
              Trigger JavaScript Error
            </Button>

            <Button onClick={triggerPromiseError} variant="destructive">
              Trigger Promise Rejection
            </Button>

            <Button onClick={triggerConsoleError} variant="destructive">
              Trigger Console Error
            </Button>
          </CardContent>
          <CardFooter>
            {errorTriggered && (
              <Alert className={success ? "border-green-500" : "border-yellow-500"}>
                {success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                <AlertTitle>{success ? "Error sent to Sentry!" : "Error triggered"}</AlertTitle>
                <AlertDescription>
                  {success
                    ? "The error was successfully captured and sent to Sentry. Check your Sentry dashboard."
                    : "Error was triggered, but we couldn't confirm if Sentry captured it. Check your Sentry dashboard."}
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Steps</CardTitle>
            <CardDescription>Follow these steps to verify your Sentry integration is working</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Click one of the error buttons on the left</li>
              <li>Check your browser console for the error</li>
              <li>Go to your Sentry dashboard</li>
              <li>Look for a new error event</li>
              <li>Verify the error details match what was triggered</li>
            </ol>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Note: It may take a few moments for the error to appear in your Sentry dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
