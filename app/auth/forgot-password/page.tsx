import type { Metadata } from "next"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Forgot Password - Big Based",
  description: "Reset your Big Based account password",
}

export default function ForgotPasswordPage() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">Reset your password</h2>
      <ForgotPasswordForm />
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-300">
          Remember your password?{" "}
          <Link href="/auth/sign-in" className="text-primary hover:underline font-medium dark:text-blue-400">
            Sign in
          </Link>
        </p>
      </div>
    </>
  )
}
