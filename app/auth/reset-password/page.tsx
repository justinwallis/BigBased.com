import type { Metadata } from "next"
import ResetPasswordForm from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password - Big Based",
  description: "Set a new password for your Big Based account",
}

export default function ResetPasswordPage() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-6 text-center">Set a new password</h2>
      <ResetPasswordForm />
    </>
  )
}
