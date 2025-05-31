"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, ArrowLeft, CreditCard, AlertCircle } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"
import { completeSubscription } from "@/app/actions/subscription-actions"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

export default function CheckoutClientPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const planId = searchParams.get("plan")
  const plan = planId ? SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS] : null

  useEffect(() => {
    if (!plan) {
      setError("Invalid plan selected")
    }
  }, [plan])

  const handleCompleteCheckout = async () => {
    if (!planId) return

    setIsProcessing(true)
    try {
      const result = await completeSubscription(planId)
      if (result.success) {
        toast({
          title: "Subscription Activated",
          description: `Your ${plan?.name} subscription has been activated successfully.`,
        })
        router.push("/profile/billing?success=true")
      } else {
        setError(result.error || "Failed to complete subscription")
        toast({
          title: "Error",
          description: result.error || "Failed to complete subscription",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred")
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Invalid plan selected"}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/profile/billing")} variant="outline">
              Return to Billing
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with navigation and theme toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/profile/billing")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Billing</span>
            </Button>
            <h1 className="text-3xl font-bold">Complete Your Subscription</h1>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Left column - Order summary */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Subscription details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">{plan.name}</span>
                  <span>${plan.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Billing cycle</span>
                  <span>Monthly</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Total due today</span>
                    <span>${plan.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    You'll be charged ${plan.price.toFixed(2)} every month until you cancel.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">What's included:</h4>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Payment form */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Method</span>
                </CardTitle>
                <CardDescription>This is a mock checkout for demonstration purposes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Test Card</p>
                      <p className="text-sm text-muted-foreground">**** **** **** 4242</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4 bg-gray-50">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> This is a mock checkout page. In a real implementation, you would integrate
                    with Stripe Elements or PayPal to collect payment details securely.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button onClick={handleCompleteCheckout} disabled={isProcessing} className="w-full" size="lg">
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    `Subscribe for $${plan.price.toFixed(2)}/month`
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
