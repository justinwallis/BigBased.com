import { Suspense } from "react"
import BillingClientPage from "./BillingClientPage"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Billing & Payment Methods | Big Based",
  description: "Manage your payment methods and billing information",
}

export default async function BillingPage() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/sign-in?redirect=/profile/billing")
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillingClientPage />
    </Suspense>
  )
}
