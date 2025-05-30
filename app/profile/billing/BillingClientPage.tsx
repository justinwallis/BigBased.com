"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, AlertCircle, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StripeProvider } from "@/components/stripe-provider"
import { AddPaymentMethod } from "@/components/add-payment-method"
import { PaymentMethodCard } from "@/components/payment-method-card"
import { getOrCreateStripeCustomer, getCustomerPaymentMethods, createSetupIntent } from "@/app/actions/stripe-actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export default function BillingClientPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()

  const router = useRouter()

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
        {/* Header with navigation and theme toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center space-x-2 dark:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-3xl font-bold dark:text-white">Billing & Payment Methods</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Payment Methods Management */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-white">
              <CreditCard className="h-5 w-5" />
              <span>Saved Payment Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMethods.length === 0 ? (
              <p className="text-muted-foreground dark:text-gray-300 mb-4">No payment methods saved yet.</p>
            ) : (
              <div className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Add Payment Methods */}
        <div className="mt-6">
          {clientSecret && (
            <StripeProvider clientSecret={clientSecret} appearance={{ theme: theme === "dark" ? "night" : "stripe" }}>
              <AddPaymentMethod clientSecret={clientSecret} onSuccess={handlePaymentMethodUpdate} />
            </StripeProvider>
          )}
        </div>

        {/* Payment Methods Info */}
        <Card className="mt-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Supported Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 dark:text-gray-300">
              <div>
                <h3 className="font-medium mb-2 dark:text-white">Cards & Digital Wallets</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Credit & Debit Cards (Visa, Mastercard, Amex)</li>
                  <li>• Apple Pay (Safari on iOS/macOS)</li>
                  <li>• Google Pay (Chrome)</li>
                  <li>• Link by Stripe (Save for faster checkout)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2 dark:text-white">Coming Soon</h3>
                <ul className="space-y-1 text-sm">
                  <li>• PayPal</li>
                  <li>• Bank transfers</li>
                  <li>• Cryptocurrency</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
