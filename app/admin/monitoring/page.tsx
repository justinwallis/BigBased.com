"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface SentryStatus {
  sentryEnabled: boolean
  sentryConfigured: boolean
  dsn: string
}

export default function MonitoringPage() {
  const [sentryStatus, setSentryStatus] = useState<SentryStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchSentryStatus()
  }, [])

  const fetchSentryStatus = async () => {
    try {
      const response = await fetch("/api/admin/sentry-toggle")
      const data = await response.json()
      setSentryStatus(data)
    } catch (error) {
      console.error("Failed to fetch Sentry status:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSentry = async (enabled: boolean) => {
    setUpdating(true)
    try {
      const response = await fetch("/api/admin/sentry-toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      })

      const data = await response.json()
      if (data.success) {
        setSentryStatus((prev) => (prev ? { ...prev, sentryEnabled: enabled } : null))
        setMessage(data.message)
      }
    } catch (error) {
      console.error("Failed to toggle Sentry:", error)
      setMessage("Failed to update Sentry settings")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto py-10">Loading monitoring settings...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Monitoring & Analytics</h1>

      <Tabs defaultValue="sentry">
        <TabsList className="mb-4">
          <TabsTrigger value="sentry">Sentry</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sentry">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Sentry Error Tracking
                  {sentryStatus?.sentryEnabled ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="w-3 h-3 mr-1" />
                      Disabled
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Control error tracking and performance monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Sentry</h3>
                    <p className="text-sm text-muted-foreground">Track errors and performance issues</p>
                  </div>
                  <Switch
                    checked={sentryStatus?.sentryEnabled || false}
                    onCheckedChange={toggleSentry}
                    disabled={updating || !sentryStatus?.sentryConfigured}
                  />
                </div>

                {!sentryStatus?.sentryConfigured && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Configuration Required</AlertTitle>
                    <AlertDescription>
                      Set NEXT_PUBLIC_SENTRY_DSN environment variable to enable Sentry
                    </AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Status Update</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <h4 className="font-medium text-sm">Configuration Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {sentryStatus?.sentryConfigured ? "Configured" : "Not configured"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">DSN Status</h4>
                    <p className="text-sm text-muted-foreground">{sentryStatus?.dsn || "Not set"}</p>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Environment Variables</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 space-y-1">
                      <div>NEXT_PUBLIC_SENTRY_ENABLED=true/false</div>
                      <div>NEXT_PUBLIC_SENTRY_DSN=your_dsn_here</div>
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Settings</CardTitle>
              <CardDescription>Control domain analytics and bot filtering</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Bot Protection Active</AlertTitle>
                <AlertDescription>
                  Analytics tracking now includes bot detection and rate limiting to prevent spam from automated
                  traffic.
                </AlertDescription>
              </Alert>

              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Protected Against:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Search engine crawlers</li>
                  <li>• Social media bots</li>
                  <li>• Automated scrapers</li>
                  <li>• Rate limited requests</li>
                  <li>• Suspicious referrers</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Monitoring</CardTitle>
              <CardDescription>Monitor application performance and resource usage</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Performance Tracking</AlertTitle>
                <AlertDescription>
                  Performance monitoring is integrated with the error tracking system and will only be active when
                  Sentry is enabled.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
