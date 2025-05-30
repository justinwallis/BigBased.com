"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Check, Crown, Star, Zap, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { createCheckoutSession } from "@/app/actions/subscription-actions"
import { SUBSCRIPTION_PLANS, type PlanId } from "@/lib/subscription-plans"

interface UpgradeClientPageProps {
  currentPlanId: PlanId
  isActive: boolean
}

export default function UpgradeClientPage({ currentPlanId, isActive }: UpgradeClientPageProps) {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null)

  useEffect(() => {
    const canceled = searchParams.get("canceled")
    if (canceled === "true") {
      toast({
        title: "Upgrade Canceled",
        description: "You can upgrade anytime from your billing page",
      })
      // Remove query parameters from URL
      const url = new URL(window.location.href)
      url.searchParams.delete("canceled")
      window.history.replaceState({}, "", url.toString())
    }
  }, [searchParams, toast])

  const handleUpgrade = async (planId: PlanId) => {
    const plan = SUBSCRIPTION_PLANS[planId]
    if (!plan.stripePriceId) {
      console.error(`Missing Stripe price ID for plan: ${planId}`, plan)
      toast({
        title: "Configuration Error",
        description: "This plan is not available for purchase yet. Missing Stripe price ID.",
        variant: "destructive",
      })
      return
    }

    setIsUpgrading(planId)
    try {
      console.log(`Creating checkout session for plan: ${planId} with price ID: ${plan.stripePriceId}`)
      const result = await createCheckoutSession(plan.stripePriceId, planId)
      console.log("Checkout session result:", result)

      if (result.success && result.sessionUrl) {
        window.location.href = result.sessionUrl
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to start checkout",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUpgrading(null)
    }
  }

  const getPlanIcon = (planId: PlanId) => {
    switch (planId) {
      case "free":
        return <Star className="h-6 w-6 text-gray-500" />
      case "based_supporter":
        return <Zap className="h-6 w-6 text-blue-500" />
      case "based_patriot":
        return <Crown className="h-6 w-6 text-purple-500" />
      default:
        return <Star className="h-6 w-6 text-gray-500" />
    }
  }

  const getPlanGradient = (planId: PlanId) => {
    switch (planId) {
      case "based_supporter":
        return "from-blue-500 to-blue-600"
      case "based_patriot":
        return "from-purple-500 to-purple-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const isCurrentPlan = (planId: PlanId) => planId === currentPlanId

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center space-x-2 dark:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Billing</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold dark:text-white">Choose Your Plan</h1>
              <p className="text-muted-foreground dark:text-gray-400">
                Upgrade to unlock premium features and support our mission
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Current Plan Notice */}
        {currentPlanId !== "free" && (
          <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Current Plan: {SUBSCRIPTION_PLANS[currentPlanId].name}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You can upgrade or downgrade your plan at any time. Changes will be prorated.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(SUBSCRIPTION_PLANS).map(([planId, plan]) => {
            const isPopular = planId === "based_supporter"
            const isCurrent = isCurrentPlan(planId as PlanId)

            return (
              <Card
                key={planId}
                className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  isPopular ? "border-blue-500 shadow-lg scale-105" : ""
                } ${isCurrent ? "ring-2 ring-green-500" : ""}`}
              >
                {isPopular && (
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getPlanGradient(planId as PlanId)}`}
                  />
                )}
                {isCurrent && <Badge className="absolute top-4 right-4 bg-green-500">Current Plan</Badge>}
                {isPopular && !isCurrent && <Badge className="absolute top-4 right-4 bg-blue-500">Most Popular</Badge>}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">{getPlanIcon(planId as PlanId)}</div>
                  <CardTitle className="text-2xl dark:text-white">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold dark:text-white">${plan.price}</span>
                    {plan.interval && (
                      <span className="text-muted-foreground dark:text-gray-400">/{plan.interval}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    {planId === "free" ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUpgrade(planId as PlanId)}
                        disabled={isUpgrading !== null}
                        className={`w-full ${
                          isPopular
                            ? `bg-gradient-to-r ${getPlanGradient(planId as PlanId)} text-white hover:opacity-90`
                            : ""
                        }`}
                      >
                        {isUpgrading === planId ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : currentPlanId === "free" ? (
                          "Upgrade Now"
                        ) : (
                          "Switch Plan"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <Card className="mt-12 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 dark:text-gray-300">
            <div>
              <h4 className="font-medium dark:text-white">Can I change my plan later?</h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes are prorated and will be reflected in
                your next billing cycle.
              </p>
            </div>
            <div>
              <h4 className="font-medium dark:text-white">What payment methods do you accept?</h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                We accept all major credit cards, PayPal, Apple Pay, Google Pay, and US bank accounts through our secure
                payment processor.
              </p>
            </div>
            <div>
              <h4 className="font-medium dark:text-white">Can I cancel anytime?</h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have access to premium features
                until the end of your billing period.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
