import { SUBSCRIPTION_PLANS, type PlanId } from "@/lib/subscription-plans"

import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface SubscriptionCardProps {
  planId: PlanId
}

export function SubscriptionCard({ planId }: SubscriptionCardProps) {
  const plan = SUBSCRIPTION_PLANS[planId]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Icons.check className="h-4 w-4 text-primary" />
            {plan.features.map((feature) => (
              <div key={feature}>{feature}</div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <div className="text-2xl font-semibold">{plan.price === 0 ? "Free" : `$${plan.price}`}</div>
        <Link href="/pricing" className={cn(buttonVariants())}>
          {plan.price === 0 ? "Get Started" : "Upgrade"}
        </Link>
      </CardFooter>
    </Card>
  )
}
