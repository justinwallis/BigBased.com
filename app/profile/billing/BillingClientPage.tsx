"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { StripeProvider } from "@/components/stripe-provider"
import { AddPaymentMethod } from "@/components/add-payment-method"
import { PaymentMethodCard } from "@/components/payment-method-card"
import { getOrCreateStripeCustomer, getCustomerPaymentMethods, createSetupIntent } from "@/app/actions/stripe-actions"
import { useToast } from "@/hooks/use-toast"

export default function BillingClientPage() {
  const { toast } = useToast()
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<string | null>(null)

  useEffect(() => {
    initializeStripe()
  }, [])

  const initializeStripe = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setDebugInfo(null)

      // Get or create Stripe customer
      const customerResult = await getOrCreateStripeCustomer()
      console.log("Customer result:", customerResult)

      if (!customerResult.success) {
        setError(customerResult.error || "Failed to initialize billing")
        if (customerResult.debug) {
          setDebugInfo(customerResult.debug)
        }
        return
      }

      setCustomerId(customerResult.customerId!)

      // Load payment methods
      await loadPaymentMethods(customerResult.customerId!)

      // Create setup intent for adding new payment methods
      const setupResult = await createSetupIntent(customerResult.customerId!)
      if (setupResult.success) {
        setClientSecret(setupResult.clientSecret!)
      } else {
        setError("Failed to initialize payment setup")
        if (setupResult.debug) {
          setDebugInfo(setupResult.debug)
        }
      }
    } catch (error) {
      console.error("Billing initialization error:", error)
      setError("Failed to initialize billing system")
      setDebugInfo(error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPaymentMethods = async (customerId: string) => {
    try {
      const result = await getCustomerPaymentMethods(customerId)
      if (result.success) {
        setPaymentMethods(result.paymentMethods || [])
      }
    } catch (error) {
      console.error("Error loading payment methods:", error)
    }
  }

  const handlePaymentMethodUpdate = () => {
    if (customerId) {
      loadPaymentMethods(customerId)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Billing & Payment Methods</h1>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2 text-foreground">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Loading billing information...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Billing & Payment Methods</h1>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 text-destructive mb-4">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Billing System Error</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>

              {process.env.NODE_ENV === "development" && debugInfo && (
                <div className="mt-4 p-4 bg-gray-800 rounded-md overflow-auto max-h-60">
                  <pre className="text-xs text-gray-300">{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}

              <Button onClick={initializeStripe} className="mt-4">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Billing & Payment Methods</h1>
        </div>

        <div className="space-y-6">
          {/* Payment Methods Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Methods</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No payment methods added yet</p>
                  <p className="text-sm">Add a payment method to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((pm) => (
                    <PaymentMethodCard
                      key={pm.id}
                      paymentMethod={pm}
                      customerId={customerId!}
                      isDefault={pm.id === defaultPaymentMethod}
                      onUpdate={handlePaymentMethodUpdate}
                    />
                  ))}
                </div>
              )}

              {clientSecret && (
                <StripeProvider clientSecret={clientSecret}>
                  <AddPaymentMethod clientSecret={clientSecret} onSuccess={handlePaymentMethodUpdate} />
                </StripeProvider>
              )}
            </CardContent>
          </Card>

          {/* Billing History Section */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No billing history available</p>
                <p className="text-sm">Your invoices and payment history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
