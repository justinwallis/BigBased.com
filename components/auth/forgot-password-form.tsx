"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { resetPasswordRequest } from "@/app/actions/auth-actions"
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

export default function ForgotPasswordForm() {
  const [state, setState] = useState<State>(initialState)

  return (
    <form
      className="space-y-4"
      action={async (formData) => {
        const result = await resetPasswordRequest(formData)

        if (result?.error) {
          setState({ message: result.error, success: false })
        } else {
          setState({
            message: "Password reset instructions have been sent to your email.",
            success: true,
          })
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
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <Label htmlFor="email" className="text-gray-900 dark:text-white">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="text-gray-900 dark:text-white"
        />
      </div>

      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Sending reset link..." : "Send reset link"}
    </Button>
  )
}
