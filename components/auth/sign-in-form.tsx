"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { supabaseClient } from "@/lib/supabase/client"
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

  async function handleSignIn(formData: FormData) {
    try {
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      if (!email || !password) {
        setState({ message: "Email and password are required", success: false })
        return
      }

      const supabase = supabaseClient()
      if (!supabase) {
        setState({ message: "Authentication service unavailable", success: false })
        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setState({ message: error.message, success: false })
        return
      }

      setState({ message: "Sign in successful! Redirecting...", success: true })
      // Redirect to profile or dashboard after successful login
      setTimeout(() => {
        router.push("/profile")
      }, 1000)
    } catch (error) {
      console.error("Sign in error:", error)
      setState({ message: "An unexpected error occurred", success: false })
    }
  }

  return (
    <form className="space-y-4" action={handleSignIn}>
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
