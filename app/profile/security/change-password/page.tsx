import { Suspense } from "react"
import ChangePasswordClientPage from "./ChangePasswordClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Change Password | Big Based",
  description: "Change your account password securely",
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordClientPage />
    </Suspense>
  )
}
