"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { signIn } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface State {
  message: string | null
  success: boolean
}

const initialState: State = {
  message: null,
  success: false,
}

export default function SignInForm() {
  const [state, setState] = useState<State>(initialState)
  const router = useRouter()

  return (
    <form
      className="space-y-4"
      action={async (formData) => {
        const result = await signIn(formData)

        if (result?.error) {
          setState({ message: result.error, success: false })
        } else if (result?.success) {
          setState({ message: "Sign in successful! Redirecting...", success: true })
          // Redirect to profile or dashboard after successful login
          setTimeout(() => {
            router.push("/profile")
          }, 1000)
        }
      }}
    >
      {state.message && (
        <Alert variant={state.success ? "default" : "destructive"} className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>

      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  )
}
