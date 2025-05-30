"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bug, RefreshCw, Database, User } from "lucide-react"
import Link from "next/link"
import { debugUserProfile, testProfileCreation } from "@/app/actions/debug-actions"

export default function BillingDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTest, setActiveTest] = useState<string | null>(null)

  const runDebug = async () => {
    setIsLoading(true)
    setActiveTest("profile-debug")
    try {
      const result = await debugUserProfile()
      setDebugInfo(result)
    } catch (error) {
      setDebugInfo({ error: error.message })
    } finally {
      setIsLoading(false)
      setActiveTest(null)
    }
  }

  const testProfileCreate = async () => {
    setIsLoading(true)
    setActiveTest("profile-create")
    try {
      const result = await testProfileCreation()
      setDebugInfo(result)
    } catch (error) {
      setDebugInfo({ error: error.message })
    } finally {
      setIsLoading(false)
      setActiveTest(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/profile/billing">
            <Button variant="ghost" size="sm" className="text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Billing
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Billing Debug Console</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bug className="h-5 w-5" />
                <span>Debug Tests</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={runDebug}
                disabled={isLoading}
                className="w-full"
                variant={activeTest === "profile-debug" ? "secondary" : "default"}
              >
                {isLoading && activeTest === "profile-debug" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running Profile Debug...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Debug Profile Access
                  </>
                )}
              </Button>

              <Button
                onClick={testProfileCreate}
                disabled={isLoading}
                className="w-full"
                variant={activeTest === "profile-create" ? "secondary" : "outline"}
              >
                {isLoading && activeTest === "profile-create" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing Profile Creation...
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Test Profile Creation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Debug Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Profile Debug:</strong> Tests user authentication, profile access with both regular and
                  service role clients, and RLS policies.
                </p>
                <p>
                  <strong>Profile Creation:</strong> Attempts to create a profile for the current user to test database
                  permissions.
                </p>
                <p>Check the debug output below for detailed information about what's failing.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {debugInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Debug Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
                <pre className="text-xs text-green-400 whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
