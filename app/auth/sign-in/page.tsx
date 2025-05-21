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
      <h2 className="text-xl font-semibold mb-6 text-center">Sign in to your account</h2>
      <SignInForm />
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
        <Link href="/auth/forgot-password" className="text-primary hover:underline text-sm mt-2 inline-block">
          Forgot your password?
        </Link>
      </div>
    </>
  )
}
