"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Clock, AlertTriangle } from "lucide-react"
import { SUBSCRIPTION_PLANS, type PlanId } from "@/lib/subscription-plans"
import Link from "next/link"

interface SubscriptionCardProps {
  currentPlan: PlanId
  subscription: any
  isActive: boolean
  cancelAtPeriodEnd?: boolean
  currentPeriodEnd?: Date | null
  onUpgrade: () => void
  onManage: () => void
}

export function SubscriptionCard({
  currentPlan,
  subscription,
  isActive,
  cancelAtPeriodEnd = false,
  currentPeriodEnd = null,
  onUpgrade,
  onManage,
}: SubscriptionCardProps) {
  const plan = SUBSCRIPTION_PLANS[currentPlan]
  const isPaid = currentPlan !== "free"

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <Card className="border-2 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl dark:text-white">{plan.name}</CardTitle>
            <CardDescription className="dark:text-gray-400">
              {isPaid ? "Active subscription" : "Basic access"}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold dark:text-white">${plan.price}</div>
            {plan.interval && <div className="text-sm text-muted-foreground dark:text-gray-400">/{plan.interval}</div>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Features */}
        <div className="space-y-2">
          {plan.features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm dark:text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* Subscription Status */}
        {isPaid && (
          <div className="pt-2">
            {isActive && !cancelAtPeriodEnd && (
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <Check className="h-4 w-4 mr-2" />
                <span>Active subscription</span>
              </div>
            )}
            {isActive && cancelAtPeriodEnd && currentPeriodEnd && (
              <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                <Clock className="h-4 w-4 mr-2" />
                <span>Cancels on {formatDate(currentPeriodEnd)}</span>
              </div>
            )}
            {!isActive && (
              <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>Subscription inactive</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isPaid ? (
          <Button variant="outline" onClick={onManage} className="w-full">
            Manage Subscription
          </Button>
        ) : (
          <Link href="/profile/billing/upgrade" className="w-full">
            <Button className="w-full">Upgrade Plan</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
