"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Loader2, Database, CreditCard, User, Settings, Wifi } from "lucide-react"

export default function BillingDebugPage() {
  const [results, setResults] = useState<any>({})
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsLoading(testName)
    try {
      const result = await testFn()
      setResults((prev: any) => ({ ...prev, [testName]: result }))
    } catch (error: any) {
      setResults((prev: any) => ({
        ...prev,
        [testName]: { success: false, error: error.message, stack: error.stack },
      }))
    } finally {
      setIsLoading(null)
    }
  }

  const testEnvironment = async () => {
    const response = await fetch("/api/debug/environment", { method: "POST" })
    return await response.json()
  }

  const testSupabaseConnection = async () => {
    const response = await fetch("/api/debug/supabase", { method: "POST" })
    return await response.json()
  }

  const testConnectionDetails = async () => {
    const response = await fetch("/api/debug/connection-test", { method: "POST" })
    return await response.json()
  }

  const testProfilesTable = async () => {
    const response = await fetch("/api/debug/profiles", { method: "POST" })
    return await response.json()
  }

  const testStripeConnection = async () => {
    const response = await fetch("/api/debug/stripe", { method: "POST" })
    return await response.json()
  }

  const testStripeCustomerCreation = async () => {
    const response = await fetch("/api/debug/stripe-customer", { method: "POST" })
    return await response.json()
  }

  const testFullBillingFlow = async () => {
    const response = await fetch("/api/debug/billing-flow", { method: "POST" })
    return await response.json()
  }

  const testDirectColumn = async () => {
    const response = await fetch("/api/debug/direct-column-test", { method: "POST" })
    return await response.json()
  }

  const runAllTests = async () => {
    await runTest("environment", testEnvironment)
    await runTest("connectionDetails", testConnectionDetails)
    await runTest("supabase", testSupabaseConnection)
    await runTest("profiles", testProfilesTable)
    await runTest("stripe", testStripeConnection)
    await runTest("stripeCustomer", testStripeCustomerCreation)
    await runTest("billingFlow", testFullBillingFlow)
  }

  const renderResult = (result: any) => {
    if (!result) return null

    const isSuccess = result.success !== false && !result.error
    const icon = isSuccess ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    )

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {icon}
          <Badge variant={isSuccess ? "default" : "destructive"}>{isSuccess ? "PASS" : "FAIL"}</Badge>
        </div>
        <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-96">{JSON.stringify(result, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Billing System Debug Console</h1>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={runAllTests} disabled={isLoading !== null} className="flex items-center space-x-2">
                  {isLoading === "all" && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Run All Tests</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => runTest("connectionDetails", testConnectionDetails)}
                  disabled={isLoading !== null}
                  className="flex items-center space-x-2"
                >
                  {isLoading === "connectionDetails" && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Wifi className="h-4 w-4" />
                  <span>Test Connection Details</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => runTest("environment", testEnvironment)}
                  disabled={isLoading !== null}
                  className="flex items-center space-x-2"
                >
                  {isLoading === "environment" && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Settings className="h-4 w-4" />
                  <span>Test Environment</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => runTest("supabase", testSupabaseConnection)}
                  disabled={isLoading !== null}
                  className="flex items-center space-x-2"
                >
                  {isLoading === "supabase" && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Database className="h-4 w-4" />
                  <span>Test Supabase</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => runTest("profiles", testProfilesTable)}
                  disabled={isLoading !== null}
                  className="flex items-center space-x-2"
                >
                  {isLoading === "profiles" && <Loader2 className="h-4 w-4 animate-spin" />}
                  <User className="h-4 w-4" />
                  <span>Test Profiles</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => runTest("stripe", testStripeConnection)}
                  disabled={isLoading !== null}
                  className="flex items-center space-x-2"
                >
                  {isLoading === "stripe" && <Loader2 className="h-4 w-4 animate-spin" />}
                  <CreditCard className="h-4 w-4" />
                  <span>Test Stripe</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => runTest("stripeCustomer", testStripeCustomerCreation)}
                  disabled={isLoading !== null}
                  className="flex items-center space-x-2"
                >
                  {isLoading === "stripeCustomer" && <Loader2 className="h-4 w-4 animate-spin" />}
                  <CreditCard className="h-4 w-4" />
                  <span>Test Customer Creation</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => runTest("billingFlow", testFullBillingFlow)}
                  disabled={isLoading !== null}
                  className="flex items-center space-x-2"
                >
                  {isLoading === "billingFlow" && <Loader2 className="h-4 w-4 animate-spin" />}
                  <CreditCard className="h-4 w-4" />
                  <span>Test Full Flow</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => runTest("directColumn", testDirectColumn)}
                  disabled={isLoading !== null}
                  className="flex items-center space-x-2"
                >
                  {isLoading === "directColumn" && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Database className="h-4 w-4" />
                  <span>Test Direct Column Access</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          {Object.entries(results).map(([testName, result]) => (
            <Card key={testName}>
              <CardHeader>
                <CardTitle className="capitalize">{testName.replace(/([A-Z])/g, " $1").trim()} Test Results</CardTitle>
              </CardHeader>
              <CardContent>{renderResult(result)}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
