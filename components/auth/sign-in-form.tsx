"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface State {
  message: string | null
  success: boolean
  loading: boolean
}

const initialState: State = {
  message: null,
  success: false,
  loading: false,
}

export default function SignInForm() {
  const [state, setState] = useState<State>(initialState)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setState({ ...state, loading: true, message: null })

    try {
      const result = await signIn(formData)

      if (result?.error) {
        setState({ message: result.error, success: false, loading: false })
      } else if (result?.success) {
        setState({ message: "Sign in successful! Redirecting...", success: true, loading: false })
        // Store that user has logged in before
        localStorage.setItem("hasLoggedInBefore", "true")
        // Redirect to profile or dashboard after successful login
        setTimeout(() => {
          router.push("/profile")
          router.refresh() // Refresh to update auth state
        }, 1000)
      } else {
        setState({ message: "An unknown error occurred", success: false, loading: false })
      }
    } catch (error) {
      console.error("Sign in form error:", error)
      setState({
        message: error instanceof Error ? error.message : "An unknown error occurred",
        success: false,
        loading: false,
      })
    }
  }

  return (
    <form className="space-y-6 max-w-sm mx-auto" action={handleSubmit}>
      {state.message && (
        <Alert variant={state.success ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-white">
            Password
          </Label>
          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <Button type="submit" className="w-full" disabled={state.loading}>
        <span className="text-white dark:text-white">{state.loading ? "Loading... 🇺🇸" : "Sign in"}</span>
      </Button>
    </form>
  )
}
