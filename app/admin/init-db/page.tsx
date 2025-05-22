"use client"

import { useState, useEffect } from "react"
import { initDatabase, checkDatabaseStatus } from "@/app/actions/init-db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Database, RefreshCw } from "lucide-react"

export default function InitDbPage() {
  const [initResult, setInitResult] = useState<any>(null)
  const [statusResult, setStatusResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)

  const handleInit = async () => {
    setLoading(true)
    try {
      const result = await initDatabase()
      setInitResult(result)
      // Refresh status after initialization
      if (result.success) {
        await checkStatus()
      }
    } catch (error) {
      setInitResult({
        success: false,
        message: "Error initializing database",
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  const checkStatus = async () => {
    setChecking(true)
    try {
      const result = await checkDatabaseStatus()
      setStatusResult(result)
    } catch (error) {
      setStatusResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Database className="h-8 w-8" />
          CMS Database Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Initialize and manage your CMS database tables</p>
      </div>

      {/* Database Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Database Status
            <Button variant="outline" size="sm" onClick={checkStatus} disabled={checking}>
              <RefreshCw className={`h-4 w-4 mr-2 ${checking ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>Current status of CMS database tables</CardDescription>
        </CardHeader>
        <CardContent>
          {statusResult ? (
            statusResult.success ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(statusResult.tables).map(([tableName, info]: [string, any]) => (
                  <div key={tableName} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium capitalize">{tableName}</div>
                      <div className="text-sm text-gray-500">{info.count} records</div>
                    </div>
                    {info.exists ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-red-600 dark:text-red-400">Error checking database status: {statusResult.error}</div>
            )
          ) : (
            <div className="text-gray-500">Loading status...</div>
          )}
        </CardContent>
      </Card>

      {/* Initialize Database */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Initialize Database</CardTitle>
          <CardDescription>Create all necessary tables and default data for the CMS</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleInit} disabled={loading} className="w-full md:w-auto">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Initialize Database
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Initialization Result */}
      {initResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {initResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              {initResult.success ? "Success!" : "Error"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{initResult.message}</p>

            {initResult.success && initResult.details && (
              <div className="space-y-2">
                <h4 className="font-medium">Table Creation Results:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(initResult.details).map(([table, result]: [string, any]) => (
                    <Badge key={table} variant="outline" className="justify-start">
                      {table}: {result?.error ? "Error" : "Success"}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {initResult.error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Error Details:</h4>
                <pre className="text-sm text-red-700 dark:text-red-300 overflow-auto">
                  {typeof initResult.error === "string" ? initResult.error : JSON.stringify(initResult.error, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="mt-8 flex gap-4">
        <Button variant="outline" asChild>
          <a href="/admin">← Back to Admin</a>
        </Button>
        {statusResult?.success && (
          <Button asChild>
            <a href="/admin">Go to CMS →</a>
          </Button>
        )}
      </div>
    </div>
  )
}
