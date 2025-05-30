import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import UpgradeClientPage from "./UpgradeClientPage"
import { getCurrentSubscription } from "@/app/actions/subscription-actions"
import { redirect } from "next/navigation"

// Make this route dynamic to fix the cookies error
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Upgrade Your Plan - Big Based",
  description: "Choose the plan that best fits your needs and upgrade your Big Based experience.",
}

export default async function UpgradePage() {
  try {
    const result = await getCurrentSubscription()

    if (!result.success) {
      redirect("/auth/sign-in?callbackUrl=/profile/billing/upgrade")
    }

    const currentPlanId = result.currentPlan?.id || "free"
    const isActive = result.isActive || false

    return (
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        }
      >
        <UpgradeClientPage currentPlanId={currentPlanId} isActive={isActive} />
      </Suspense>
    )
  } catch (error) {
    console.error("Error in upgrade page:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">We couldn't load your subscription information.</p>
          <a href="/profile/billing" className="text-blue-500 hover:underline">
            Return to billing
          </a>
        </div>
      </div>
    )
  }
}
