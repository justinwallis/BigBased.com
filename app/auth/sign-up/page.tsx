import type { Metadata } from "next"
import SignUpForm from "@/components/auth/sign-up-form"
import Link from "next/link"
import { BBLogoAuth } from "@/components/bb-logo-auth"

export const metadata: Metadata = {
  title: "Sign Up - Big Based",
  description: "Create your Big Based account",
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <BBLogoAuth />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}
