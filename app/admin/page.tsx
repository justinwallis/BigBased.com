"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function AdminSetupPage() {
  const [secret, setSecret] = useState(process.env.PAYLOAD_SECRET || "")
  const [email, setEmail] = useState("admin@bigbased.com")
  const [password, setPassword] = useState("BigBased2024!")
  const [tablesSetup, setTablesSetup] = useState(false)
  const [adminCreated, setAdminCreated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const setupTables = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/payload/setup-tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to setup database tables")
      }

      setSuccess("Database tables created successfully!")
      setTablesSetup(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createAdmin = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/payload/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to create admin user")
      }

      setSuccess("Admin user created successfully!")
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
          <CardDescription>Set up your CMS database and create an admin user to get started.</CardDescription>
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

          {tablesSetup && (
            <>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Admin Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Admin Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a secure password"
                  required
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {!tablesSetup && (
            <Button className="w-full" onClick={setupTables} disabled={loading || !secret}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting up database...
                </>
              ) : (
                "1. Setup Database Tables"
              )}
            </Button>
          )}

          {tablesSetup && !adminCreated && (
            <Button className="w-full" onClick={createAdmin} disabled={loading || !email || !password}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating admin user...
                </>
              ) : (
                "2. Create Admin User"
              )}
            </Button>
          )}

          {adminCreated && (
            <div className="space-y-4 w-full">
              <Button className="w-full" onClick={() => window.open("/api/payload", "_blank")}>
                Go to CMS Admin
              </Button>
              <div className="text-sm text-center text-gray-500">
                <p>Login with:</p>
                <p>Email: {email}</p>
                <p>Password: {password}</p>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
