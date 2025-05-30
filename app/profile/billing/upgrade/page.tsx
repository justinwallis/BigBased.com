import { getCurrentSubscription } from "@/app/actions/subscription-actions"
import UpgradeClientPage from "./UpgradeClientPage"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Upgrade Your Plan - Big Based",
  description: "Choose the plan that best fits your needs and upgrade your Big Based experience.",
}

export default async function UpgradePage() {
  const result = await getCurrentSubscription()

  if (!result.success) {
    redirect("/auth/sign-in?callbackUrl=/profile/billing/upgrade")
  }

  const currentPlanId = result.currentPlan?.id || "free"
  const isActive = result.isActive || false

  return <UpgradeClientPage currentPlanId={currentPlanId} isActive={isActive} />
}
