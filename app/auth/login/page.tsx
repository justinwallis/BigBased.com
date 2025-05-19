import type { Metadata } from "next"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Log In - Big Based",
  description: "Log in to your Big Based account",
}

export default function LoginPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Log In</h1>
        <LoginForm />
      </div>
    </div>
  )
}
