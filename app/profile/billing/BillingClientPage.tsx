"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, CreditCard, Calendar, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCurrentSubscription } from "@/app/actions/subscription-actions"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

export default function BillingClientPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const result = await getCurrentSubscription()
        setSubscription(result)
      } catch (error) {
        console.error("Error fetching subscription:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const currentPlan = subscription?.currentPlan || SUBSCRIPTION_PLANS.free
  const isActive = subscription?.isActive || false
  const isPaidPlan = currentPlan.id !== "free"

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-2">Manage your subscription and billing information.</p>
        </div>
        <Button onClick={() => router.push("/profile/billing/upgrade")} className="flex items-center space-x-2">
          <span>Upgrade Plan</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Plan Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Current Plan</span>
                <Badge variant={isPaidPlan ? "default" : "secondary"}>{currentPlan.name}</Badge>
              </CardTitle>
              <CardDescription>
                {isPaidPlan ? `You're subscribed to the ${currentPlan.name} plan` : "You're currently on the free plan"}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${currentPlan.price}</div>
              {currentPlan.interval && <div className="text-sm text-muted-foreground">per {currentPlan.interval}</div>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Plan Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {currentPlan.features.slice(0, 3).map((feature: string, index: number) => (
                  <li key={index}>• {feature}</li>
                ))}
                {currentPlan.features.length > 3 && <li>• And {currentPlan.features.length - 3} more features...</li>}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Plan Limits</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Downloads: {currentPlan.limits.downloads === -1 ? "Unlimited" : currentPlan.limits.downloads}</div>
                <div>Bookmarks: {currentPlan.limits.bookmarks === -1 ? "Unlimited" : currentPlan.limits.bookmarks}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Status */}
      {isPaidPlan && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Subscription Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-medium">
                  {isActive ? (
                    <Badge className="bg-green-500">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Next Billing Date</div>
                <div className="font-medium">
                  {subscription?.currentPeriodEnd
                    ? subscription.currentPeriodEnd.toLocaleDateString()
                    : "Not available"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Auto Renewal</div>
                <div className="font-medium">
                  {subscription?.cancelAtPeriodEnd ? (
                    <Badge variant="outline">Canceled</Badge>
                  ) : (
                    <Badge className="bg-blue-500">Enabled</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Method */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">
              {isPaidPlan ? "Manage your payment methods in Stripe" : "No payment method required for free plan"}
            </div>
            {isPaidPlan && (
              <Button variant="outline" size="sm">
                Manage Payment Methods
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Notice for Free Users */}
      {!isPaidPlan && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Unlock Premium Features</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  Upgrade to a paid plan to access unlimited downloads, priority support, exclusive content, and more.
                </p>
                <Button onClick={() => router.push("/profile/billing/upgrade")} size="sm">
                  View Plans
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
