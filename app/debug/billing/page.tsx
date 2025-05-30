"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { debugUserProfile, testStripeCustomerCreation } from "@/app/actions/debug-actions"
import { testBillingDirect, createStripeCustomerDirect } from "@/app/actions/test-billing-direct"

export default function BillingDebugPage() {
  const [debugResult, setDebugResult] = useState<any>(null)
  const [stripeResult, setStripeResult] = useState<any>(null)
  const [directResult, setDirectResult] = useState<any>(null)
  const [directStripeResult, setDirectStripeResult] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const handleDebugProfile = async () => {
    setLoading("debug")
    try {
      const result = await debugUserProfile()
      setDebugResult(result)
    } catch (error) {
      setDebugResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(null)
    }
  }

  const handleTestStripe = async () => {
    setLoading("stripe")
    try {
      const result = await testStripeCustomerCreation()
      setStripeResult(result)
    } catch (error) {
      setStripeResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(null)
    }
  }

  const handleTestDirect = async () => {
    setLoading("direct")
    try {
      const result = await testBillingDirect()
      setDirectResult(result)
    } catch (error) {
      setDirectResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(null)
    }
  }

  const handleDirectStripe = async () => {
    setLoading("directStripe")
    try {
      const result = await createStripeCustomerDirect()
      setDirectStripeResult(result)
    } catch (error) {
      setDirectStripeResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Billing Debug Page</h1>
        <p className="text-muted-foreground">Debug billing system and Stripe integration</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Environment & Profile Debug</CardTitle>
            <CardDescription>Test environment variables and profile access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleDebugProfile} disabled={loading === "debug"} className="w-full">
              {loading === "debug" ? "Testing..." : "Debug Profile & Environment"}
            </Button>
            {debugResult && (
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
                {JSON.stringify(debugResult, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stripe RPC Functions</CardTitle>
            <CardDescription>Test Stripe customer creation with RPC functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleTestStripe} disabled={loading === "stripe"} className="w-full">
              {loading === "stripe" ? "Testing..." : "Test Stripe RPC Functions"}
            </Button>
            {stripeResult && (
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
                {JSON.stringify(stripeResult, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Direct SQL Test</CardTitle>
            <CardDescription>Test direct SQL operations to bypass cache</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleTestDirect} disabled={loading === "direct"} className="w-full">
              {loading === "direct" ? "Testing..." : "Test Direct SQL Operations"}
            </Button>
            {directResult && (
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
                {JSON.stringify(directResult, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Direct Stripe Creation</CardTitle>
            <CardDescription>Create Stripe customer using direct SQL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleDirectStripe} disabled={loading === "directStripe"} className="w-full">
              {loading === "directStripe" ? "Creating..." : "Create Stripe Customer (Direct SQL)"}
            </Button>
            {directStripeResult && (
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
                {JSON.stringify(directStripeResult, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
          <CardDescription>Additional debug information will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The billing_customers table exists in Supabase with proper policies, but there seems to be a schema cache
            issue. Try the "Direct SQL Operations" test to bypass the cache.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
