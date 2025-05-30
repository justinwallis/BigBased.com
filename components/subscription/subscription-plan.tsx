"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { SUBSCRIPTION_PLANS, type PlanId } from "@/lib/subscription-plans"
import { createCheckoutSession } from "@/app/actions/subscription-actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface SubscriptionPlanProps {
  planId: PlanId
  currentPlan?: string
  isPopular?: boolean
  className?: string
}

export function SubscriptionPlan({ planId, currentPlan, isPopular = false, className }: SubscriptionPlanProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const plan = SUBSCRIPTION_PLANS[planId]

  const isCurrentPlan = currentPlan === planId
  const isUpgrade = currentPlan === "free" && planId !== "free"
  const isDowngrade = currentPlan === "patriot" && planId === "supporter"

  const handleSubscribe = async () => {
    if (isCurrentPlan) return

    setIsLoading(true)
    try {
      const { url, error } = await createCheckoutSession(planId)

      if (error) {
        console.error("Checkout error:", error)
        return
      }

      if (url) {
        router.push(url)
      }
    } catch (error) {
      console.error("Subscription error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    if (isCurrentPlan) return "Current Plan"
    if (isUpgrade) return "Upgrade Now"
    if (isDowngrade) return "Downgrade"
    return "Get Started"
  }

  const getButtonVariant = () => {
    if (isCurrentPlan) return "outline"
    if (isPopular) return "default"
    return "outline"
  }

  return (
    <Card className={`relative ${isPopular ? "border-primary shadow-lg" : ""} ${className}`}>
      {isPopular && <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary">Most Popular</Badge>}

      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Icons.crown className="h-5 w-5" />
          {plan.name}
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">${plan.price}</span>
          {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Icons.check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={getButtonVariant()}
          onClick={handleSubscribe}
          disabled={isCurrentPlan || isLoading}
        >
          {isLoading ? "Processing..." : getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  )
}
