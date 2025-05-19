import type { Metadata } from "next"
import SignupForm from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign Up - Big Based",
  description: "Create your Big Based account",
}

export default function SignupPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Your Account</h1>
        <SignupForm />
      </div>
    </div>
  )
}
