"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Copy } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function SetupPage() {
  const [secret, setSecret] = useState("")
  const [loading, setLoading] = useState(false)
  const [setupStatus, setSetupStatus] = useState<null | {
    success: boolean
    message: string
    details?: string
    sqlScript?: string
  }>(null)
  const [adminCredentials, setAdminCredentials] = useState<null | { email: string; password: string }>(null)

  const handleSetupDatabase = async () => {
    if (!secret) return

    setLoading(true)
    setSetupStatus(null)

    try {
      const response = await fetch("/api/payload/setup-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSetupStatus({ success: true, message: data.message })

        // If admin credentials were returned directly
        if (data.adminEmail && data.adminPassword) {
          setAdminCredentials({
            email: data.adminEmail,
            password: data.adminPassword,
          })
        }
      } else {
        setSetupStatus({
          success: false,
          message: data.error || "Failed to setup database",
          details: data.details,
          sqlScript: data.sqlScript,
        })
      }
    } catch (error) {
      setSetupStatus({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("SQL script copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Big Based CMS Setup</CardTitle>
          <CardDescription>Initialize your Payload CMS database and create an admin user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="secret" className="text-sm font-medium">
              Payload Secret
            </label>
            <Input
              id="secret"
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter your PAYLOAD_SECRET"
            />
          </div>

          {setupStatus && (
            <Alert variant={setupStatus.success ? "default" : "destructive"}>
              {setupStatus.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{setupStatus.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>
                {setupStatus.message}
                {setupStatus.details && <div className="mt-2 text-xs opacity-80">{setupStatus.details}</div>}
              </AlertDescription>
            </Alert>
          )}

          {setupStatus?.sqlScript && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Manual SQL Setup Required</h3>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(setupStatus.sqlScript || "")}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
              <Textarea className="font-mono text-xs h-48" value={setupStatus.sqlScript} readOnly />
              <p className="text-xs mt-2">
                Copy this SQL and run it in your Supabase SQL Editor, then return here to continue.
              </p>
            </div>
          )}

          {adminCredentials && (
            <div className="p-4 border rounded-md bg-gray-50">
              <h3 className="font-medium mb-2">Admin Credentials</h3>
              <p className="text-sm">Email: {adminCredentials.email}</p>
              <p className="text-sm">Password: {adminCredentials.password}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleSetupDatabase} disabled={loading || !secret}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Setup Database & Create Admin
          </Button>
          {adminCredentials && (
            <Button className="w-full" variant="outline" onClick={() => (window.location.href = "/admin")}>
              Go to Admin Panel
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
