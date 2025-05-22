import type { Metadata } from "next"
import Link from "next/link"
import SignUpForm from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up - Big Based",
  description: "Create your Big Based account",
}

export default function SignUpPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
      </div>
      <SignUpForm />
    </>
  )
}
