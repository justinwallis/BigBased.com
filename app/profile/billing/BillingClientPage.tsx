"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, AlertCircle, ArrowLeft, CreditCardIcon, Info, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StripeProvider } from "@/components/stripe-provider"
import { AddPaymentMethod } from "@/components/add-payment-method"
import { PaymentMethodCard } from "@/components/payment-method-card"
import {
  getOrCreateStripeCustomer,
  getCustomerPaymentMethods,
  createSetupIntent,
  setPayPalAsDefault,
  getDefaultPaymentMethodPreference,
} from "@/app/actions/stripe-actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PayPalPayment } from "@/components/paypal-payment"

export default function BillingClientPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState("stripe")
  const [paypalConnected, setPaypalConnected] = useState(false)
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState<string | null>(null)
  const [isPayPalDefault, setIsPayPalDefault] = useState(false)
  const [isSettingPayPalDefault, setIsSettingPayPalDefault] = useState(false)

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

      // Get payment methods and default payment method
      const paymentMethodsResult = await getCustomerPaymentMethods(customerResult.customerId)
      if (paymentMethodsResult.success) {
        setPaymentMethods(paymentMethodsResult.paymentMethods || [])
        setDefaultPaymentMethodId(paymentMethodsResult.defaultPaymentMethodId)
      }

      // Get default payment method preference (PayPal vs Stripe)
      const preferenceResult = await getDefaultPaymentMethodPreference()
      if (preferenceResult.success) {
        setIsPayPalDefault(preferenceResult.isPayPalDefault)
        // If PayPal is set as default, assume it's connected
        if (preferenceResult.isPayPalDefault) {
          setPaypalConnected(true)
        }
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

  const handlePayPalSetup = (details: any) => {
    setPaypalConnected(true)
    toast({
      title: "PayPal Connected",
      description: "PayPal is now available for payments",
    })
  }

  const handleSetPayPalAsDefault = async () => {
    if (!customerId) return

    setIsSettingPayPalDefault(true)
    try {
      const result = await setPayPalAsDefault(customerId)
      if (result.success) {
        setIsPayPalDefault(true)
        setDefaultPaymentMethodId(null) // Clear Stripe default since PayPal is now default
        toast({
          title: "Default payment method updated",
          description: "PayPal is now your default payment method",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to set PayPal as default",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSettingPayPalDefault(false)
    }
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

        {/* Default Payment Method Indicator */}
        {(isPayPalDefault || defaultPaymentMethodId) && (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Default Payment Method: {isPayPalDefault ? "PayPal" : "Stripe Payment Method"}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {isPayPalDefault
                      ? "PayPal will be used for all payments by default"
                      : "Your selected Stripe payment method will be used by default"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods Management */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-white">
              <CreditCard className="h-5 w-5" />
              <span>Saved Payment Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMethods.length === 0 && !paypalConnected ? (
              <p className="text-muted-foreground dark:text-gray-300 mb-4">No payment methods saved yet.</p>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((pm) => (
                  <PaymentMethodCard
                    key={pm.id}
                    paymentMethod={pm}
                    customerId={customerId!}
                    isDefault={defaultPaymentMethodId === pm.id && !isPayPalDefault}
                    onUpdate={handlePaymentMethodUpdate}
                  />
                ))}

                {/* Show PayPal as connected if setup */}
                {paypalConnected && (
                  <Card
                    className={`overflow-hidden ${isPayPalDefault ? "border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-400" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5 text-blue-600 dark:text-blue-400"
                            >
                              <path d="M7 11l5-7" />
                              <path d="M21 11V6a2 2 0 0 0-2-2h-4l5 7" />
                              <path d="M3 11v5a2 2 0 0 0 2 2h4l5-7" />
                              <path d="M17 11v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-5" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium dark:text-white">PayPal Account</p>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">
                              Connected • Available for payments
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isPayPalDefault ? (
                            <div className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Default
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleSetPayPalAsDefault}
                              disabled={isSettingPayPalDefault}
                            >
                              {isSettingPayPalDefault ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <span className="text-xs">Set Default</span>
                              )}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPaypalConnected(false)}
                            className="dark:border-gray-600 dark:text-gray-300"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Payment Methods with Tabs */}
        <div className="mt-6">
          <Tabs defaultValue="stripe" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4 dark:bg-gray-800">
              <TabsTrigger value="stripe" className="flex items-center space-x-2 dark:data-[state=active]:bg-gray-700">
                <CreditCardIcon className="h-4 w-4" />
                <span>Card & Digital Wallets</span>
              </TabsTrigger>
              <TabsTrigger value="paypal" className="flex items-center space-x-2 dark:data-[state=active]:bg-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M7 11l5-7" />
                  <path d="M21 11V6a2 2 0 0 0-2-2h-4l5 7" />
                  <path d="M3 11v5a2 2 0 0 0 2 2h4l5-7" />
                  <path d="M17 11v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-5" />
                </svg>
                <span>PayPal</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stripe">
              {clientSecret && (
                <StripeProvider
                  clientSecret={clientSecret}
                  appearance={{ theme: theme === "dark" ? "night" : "stripe" }}
                >
                  <AddPaymentMethod
                    clientSecret={clientSecret}
                    customerId={customerId!}
                    onSuccess={handlePaymentMethodUpdate}
                  />
                </StripeProvider>
              )}
            </TabsContent>

            <TabsContent value="paypal">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M7 11l5-7" />
                      <path d="M21 11V6a2 2 0 0 0-2-2h-4l5 7" />
                      <path d="M3 11v5a2 2 0 0 0 2 2h4l5-7" />
                      <path d="M17 11v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-5" />
                    </svg>
                    <span>PayPal Setup</span>
                  </CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Connect your PayPal account for payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="dark:bg-gray-800">
                  {!paypalConnected ? (
                    <PayPalPayment mode="setup" onSuccess={handlePayPalSetup} />
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium dark:text-white mb-2">PayPal Connected</h3>
                      <p className="text-muted-foreground dark:text-gray-400 mb-4">
                        Your PayPal account is ready for payments
                      </p>
                      {!isPayPalDefault && (
                        <Button onClick={handleSetPayPalAsDefault} disabled={isSettingPayPalDefault} className="mt-2">
                          {isSettingPayPalDefault ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Setting as Default...
                            </>
                          ) : (
                            "Set as Default Payment Method"
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Payment Methods Info */}
        <Card className="mt-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-white">
              <Info className="h-5 w-5" />
              <span>Payment Method Information</span>
            </CardTitle>
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
                  <li>• US Bank Accounts (ACH)</li>
                </ul>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-2">
                  These payment methods are saved securely and can be reused.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 dark:text-white">PayPal</h3>
                <ul className="space-y-1 text-sm">
                  <li>• PayPal Account Balance</li>
                  <li>• PayPal Credit</li>
                  <li>• Cards linked to PayPal</li>
                  <li>• Bank accounts linked to PayPal</li>
                </ul>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-2">
                  PayPal requires authentication for each payment but provides access to all your PayPal payment
                  methods.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
