"use client"

import { useEffect, useState } from "react"
import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SentryDebugPage() {
  const [sentryLoaded, setSentryLoaded] = useState<boolean | null>(null)
  const [dsn, setDsn] = useState<string | null>(null)
  const [manualSendResult, setManualSendResult] = useState<string | null>(null)
  const [networkLogs, setNetworkLogs] = useState<string[]>([])
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({})

  useEffect(() => {
    // Check if Sentry is loaded
    const isSentryLoaded = typeof Sentry !== "undefined" && !!Sentry.captureMessage
    setSentryLoaded(isSentryLoaded)

    // Get DSN
    try {
      // @ts-ignore - Access internal Sentry config
      const currentDsn = Sentry.getCurrentHub()?.getClient()?.getOptions()?.dsn || "Not found"
      setDsn(currentDsn)
    } catch (e) {
      setDsn("Error getting DSN")
    }

    // Get debug info
    try {
      const info: Record<string, any> = {}

      // Check environment variables
      info.publicDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || "Not set"

      // Check Sentry initialization
      info.sentryAvailable = typeof Sentry !== "undefined"

      // @ts-ignore - Access internal Sentry config
      const client = Sentry.getCurrentHub()?.getClient()
      info.clientInitialized = !!client

      if (client) {
        try {
          // @ts-ignore - Access internal Sentry config
          info.options = { ...client.getOptions() }
          // Remove sensitive data
          delete info.options.dsn
          delete info.options.release
        } catch (e) {
          info.optionsError = "Error getting options"
        }
      }

      setDebugInfo(info)
    } catch (e) {
      setDebugInfo({ error: "Error collecting debug info" })
    }
  }, [])

  const sendManualEvent = () => {
    try {
      // Start network monitoring
      const originalFetch = window.fetch
      window.fetch = function (...args) {
        setNetworkLogs((prev) => [...prev, `Fetch request to: ${args[0]}`])
        return originalFetch
          .apply(this, args)
          .then((response) => {
            setNetworkLogs((prev) => [...prev, `Response from ${args[0]}: ${response.status}`])
            return response
          })
          .catch((error) => {
            setNetworkLogs((prev) => [...prev, `Error from ${args[0]}: ${error.message}`])
            throw error
          })
      }

      // Send test event
      const eventId = Sentry.captureMessage("Manual test event from debug page", {
        level: "info",
        tags: {
          debug: true,
          manual: true,
          timestamp: new Date().toISOString(),
        },
      })

      setManualSendResult(`Event sent with ID: ${eventId}`)

      // Restore original fetch after 5 seconds
      setTimeout(() => {
        window.fetch = originalFetch
      }, 5000)
    } catch (e) {
      setManualSendResult(`Error sending event: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const triggerRealError = () => {
    try {
      // This will cause a real error
      throw new Error("Deliberate test error from debug page")
    } catch (e) {
      if (e instanceof Error) {
        Sentry.captureException(e)
        setManualSendResult(`Exception captured: ${e.message}`)
      }
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Sentry Integration Debug</h1>

      <Tabs defaultValue="status">
        <TabsList className="mb-4">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sentry Status</CardTitle>
                <CardDescription>Current status of your Sentry integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Sentry SDK Loaded:</span>
                    <span className={sentryLoaded ? "text-green-500" : "text-red-500"}>
                      {sentryLoaded === null ? "Checking..." : sentryLoaded ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-medium">DSN Configured:</span>
                    <span className={dsn && dsn !== "Not found" ? "text-green-500" : "text-red-500"}>
                      {dsn ? (dsn === "Not found" ? "No" : "Yes") : "Checking..."}
                    </span>
                  </div>
                </div>

                <Alert className={dsn && dsn !== "Not found" ? "border-green-500" : "border-red-500"}>
                  <Info className="h-4 w-4" />
                  <AlertTitle>DSN Configuration</AlertTitle>
                  <AlertDescription className="break-all">{dsn || "Checking..."}</AlertDescription>
                </Alert>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Environment Variable</AlertTitle>
                  <AlertDescription className="break-all">
                    NEXT_PUBLIC_SENTRY_DSN: {process.env.NEXT_PUBLIC_SENTRY_DSN || "Not set"}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Test Sentry Integration</CardTitle>
              <CardDescription>Send test events to verify your Sentry integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <Button onClick={sendManualEvent} variant="default">
                  Send Manual Test Event
                </Button>

                <Button onClick={triggerRealError} variant="destructive">
                  Trigger Real Error
                </Button>
              </div>

              {manualSendResult && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Test Result</AlertTitle>
                  <AlertDescription>{manualSendResult}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Network Logs</CardTitle>
              <CardDescription>Network activity when sending events to Sentry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto">
                {networkLogs.length === 0 ? (
                  <p className="text-muted-foreground">
                    No network logs yet. Send a test event to see network activity.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {networkLogs.map((log, i) => (
                      <li key={i} className="text-sm font-mono">
                        {log}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Debug Info</CardTitle>
              <CardDescription>Detailed information about your Sentry configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
