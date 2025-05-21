"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
        // Redirect to profile or dashboard after successful login
        setTimeout(() => {
          router.push("/profile")
        }, 1000)
      } else {
        setState({ message: "An unknown error occurred", success: false, loading: false })
      }
    } catch (error) {
      setState({
        message: error instanceof Error ? error.message : "An unknown error occurred",
        success: false,
        loading: false,
      })
    }
  }

  return (
    <form className="space-y-6" action={handleSubmit}>
      {state.message && (
        <Alert variant={state.success ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full"
        />
      </div>

      <Button type="submit" className="w-full" disabled={state.loading}>
        {state.loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
