import type { Metadata } from "next"
import SignInForm from "@/components/auth/sign-in-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign In - Big Based",
  description: "Sign in to your Big Based account",
}

export default function SignInPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Or{" "}
          <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
            create a new account
          </Link>
        </p>
      </div>

      <SignInForm />

      <div className="mt-6 text-center">
        <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
          Forgot your password?
        </Link>
      </div>
    </>
  )
}
