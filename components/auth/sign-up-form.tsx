"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Reset states
    setError("")
    setSuccess(false)
    setLoading(true)

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      // Create the user with Supabase directly
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        setError("Missing Supabase configuration")
        setLoading(false)
        return
      }

      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // Success
      setSuccess(true)
      setLoading(false)

      // Redirect to sign-in page after a delay
      setTimeout(() => {
        router.push("/auth/sign-in")
      }, 3000)
    } catch (err) {
      console.error("Sign up error:", err)
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive" className="dark:bg-gray-800 dark:border-gray-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="dark:text-white">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="dark:bg-gray-800 dark:border-gray-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="dark:text-white">
            Account created successfully! Please check your email to verify your account.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-blue-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-white">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-blue-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900 dark:text-white">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-blue-400"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
