import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import BillingClientPage from "./BillingClientPage"

export default async function BillingPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  return <BillingClientPage />
}
