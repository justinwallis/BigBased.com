import type { Metadata } from "next"
import SignUpForm from "@/components/auth/sign-up-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign Up - Big Based",
  description: "Create your Big Based account",
}

export default function SignUpPage() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-6 text-center">Create your account</h2>
      <SignUpForm />
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </>
  )
}
