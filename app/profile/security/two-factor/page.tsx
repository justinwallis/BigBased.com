import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import TwoFactorClientPage from "./TwoFactorClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Two-Factor Authentication | Big Based",
  description: "Set up and manage two-factor authentication for your account",
}

export default async function TwoFactorPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/sign-in")
  }

  // Get current MFA status
  const { data: mfaData } = await supabase
    .from("mfa_settings")
    .select("mfa_enabled, mfa_type")
    .eq("id", session.user.id)
    .single()

  return (
    <TwoFactorClientPage
      user={session.user}
      currentMfaStatus={{
        enabled: mfaData?.mfa_enabled || false,
        type: mfaData?.mfa_type || null,
      }}
    />
  )
}
