"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function SetupPage() {
  const [secret, setSecret] = useState("By9nIG6fWTiA8eikLBuGmT1Q3YSGG7goHF5HmIcgXKrSdq6uR0Qe2whBN1Rmwm69")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [adminCreated, setAdminCreated] = useState(false)

  const seedDatabase = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/payload/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to seed database")
      }

      setSuccess("Database seeded successfully! Admin user is ready.")
      setAdminCreated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Big Based CMS Setup</CardTitle>
          <CardDescription>Initialize your Payload CMS with the official admin interface.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="secret" className="text-sm font-medium">
              Payload Secret
            </label>
            <Input
              id="secret"
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter your Payload secret"
              required
            />
            <p className="text-xs text-gray-500">This is your PAYLOAD_SECRET environment variable.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {!adminCreated && (
            <Button className="w-full" onClick={seedDatabase} disabled={loading || !secret}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting up CMS...
                </>
              ) : (
                "Initialize Payload CMS"
              )}
            </Button>
          )}

          {adminCreated && (
            <div className="space-y-4 w-full">
              <Button className="w-full" onClick={() => (window.location.href = "/admin")}>
                Go to Payload Admin
              </Button>
              <div className="text-sm text-center text-gray-500 bg-gray-100 p-3 rounded">
                <p className="font-medium">Admin Credentials:</p>
                <p>Email: admin@bigbased.com</p>
                <p>Password: BigBased2024!</p>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
