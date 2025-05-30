"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StripeProvider } from "@/components/stripe-provider"
import { AddPaymentMethod } from "@/components/add-payment-method"
import { PaymentMethodCard } from "@/components/payment-method-card"
import { getOrCreateStripeCustomer, getCustomerPaymentMethods, createSetupIntent } from "@/app/actions/stripe-actions"

export default function BillingClientPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadBillingData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get or create Stripe customer
      const customerResult = await getOrCreateStripeCustomer()
      if (!customerResult.success) {
        setError(customerResult.error || "Failed to load billing information")
        return
      }

      setCustomerId(customerResult.customerId)

      // Get payment methods
      const paymentMethodsResult = await getCustomerPaymentMethods(customerResult.customerId)
      if (paymentMethodsResult.success) {
        setPaymentMethods(paymentMethodsResult.paymentMethods || [])
      }

      // Create setup intent for adding new payment methods
      const setupIntentResult = await createSetupIntent(customerResult.customerId)
      if (setupIntentResult.success) {
        setClientSecret(setupIntentResult.clientSecret)
      }
    } catch (error: any) {
      console.error("Error loading billing data:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBillingData()
  }, [])

  const handlePaymentMethodUpdate = () => {
    loadBillingData()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
            <Button onClick={loadBillingData} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Billing & Payment Methods</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMethods.length === 0 ? (
              <p className="text-muted-foreground mb-4">No payment methods added yet.</p>
            ) : (
              <div className="space-y-4 mb-6">
                {paymentMethods.map((pm) => (
                  <PaymentMethodCard
                    key={pm.id}
                    paymentMethod={pm}
                    customerId={customerId!}
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
      </div>
    </div>
  )
}
