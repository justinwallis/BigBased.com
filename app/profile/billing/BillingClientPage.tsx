import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"
import { getCurrentSubscription } from "@/app/actions/subscription-actions"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SubscriptionPlan } from "@/components/subscription/subscription-plan"
import { Icons } from "@/components/icons"
import { redirect } from "next/navigation"

export default async function BillingClientPage() {
  const subscription = await getCurrentSubscription()

  if (!subscription) {
    redirect("/sign-in")
  }

  const isPro = subscription?.planId === "pro"
  const plans = Object.values(SUBSCRIPTION_PLANS)

  return (
    <div className="container max-w-3xl">
      <div className="flex justify-between items-center">
        <CardHeader className="px-0">
          <CardTitle>Billing</CardTitle>
          <p className="text-sm text-muted-foreground">Manage your subscription plan.</p>
        </CardHeader>
        <Button>
          {isPro ? (
            <>
              Manage Subscription
              <Icons.externalLink className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Upgrade to Pro
              <Icons.arrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <p className="text-sm text-muted-foreground">
            You are currently on the <span className="font-medium">{subscription?.name}</span> plan.
          </p>
        </CardHeader>
        <CardContent>
          <SubscriptionPlan key={subscription?.planId} isCurrent={true} {...subscription} />
        </CardContent>
      </Card>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <SubscriptionPlan key={plan.id} {...plan} />
        ))}
      </div>
    </div>
  )
}
