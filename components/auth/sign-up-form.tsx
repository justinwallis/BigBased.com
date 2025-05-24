"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  // Check password strength
  useEffect(() => {
    const strength = {
      score: 0,
      hasMinLength: password.length >= 10,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    }

    // Calculate score (1 point for each criteria met)
    strength.score = [
      strength.hasMinLength,
      strength.hasUppercase,
      strength.hasLowercase,
      strength.hasNumber,
      strength.hasSpecialChar,
    ].filter(Boolean).length

    setPasswordStrength(strength)

    // Check if passwords match
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    }
  }, [password, confirmPassword])

  // Get color for password strength indicator
  const getStrengthColor = () => {
    if (passwordStrength.score <= 2) return "bg-red-500"
    if (passwordStrength.score <= 3) return "bg-yellow-500"
    if (passwordStrength.score <= 4) return "bg-blue-500"
    return "bg-green-500"
  }

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
      localStorage.setItem("hasLoggedInBefore", "true")

      // Redirect to sign-in page after a delay
      setTimeout(() => {
        router.push("/auth/sign-in")
      }, 3000)
    } catch (err) {
      console.error("Sign up form error:", err)
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
          className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-blue-400 bg-gray-100 border-gray-300"
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
          className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-blue-400 bg-gray-100 border-gray-300"
        />

        {/* Password strength indicator */}
        {password.length > 0 && (
          <div className="mt-2 space-y-2">
            <div className="space-y-1">
              <Progress value={passwordStrength.score * 20} className={getStrengthColor()} />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Password strength:{" "}
                {passwordStrength.score <= 2
                  ? "Weak"
                  : passwordStrength.score <= 3
                    ? "Fair"
                    : passwordStrength.score <= 4
                      ? "Good"
                      : "Strong"}
              </p>
            </div>

            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                {passwordStrength.hasMinLength ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs dark:text-gray-300">At least 10 characters</span>
              </li>
              <li className="flex items-center gap-2">
                {passwordStrength.hasUppercase ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs dark:text-gray-300">At least one uppercase letter</span>
              </li>
              <li className="flex items-center gap-2">
                {passwordStrength.hasLowercase ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs dark:text-gray-300">At least one lowercase letter</span>
              </li>
              <li className="flex items-center gap-2">
                {passwordStrength.hasNumber ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs dark:text-gray-300">At least one number</span>
              </li>
              <li className="flex items-center gap-2">
                {passwordStrength.hasSpecialChar ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs dark:text-gray-300">At least one special character</span>
              </li>
            </ul>
          </div>
        )}
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
          className={`w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-blue-400 bg-gray-100 border-gray-300 ${
            confirmPassword && !passwordsMatch ? "border-red-500" : ""
          }`}
        />
        {confirmPassword && !passwordsMatch && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        <span className="text-white dark:text-black">{loading ? "Loading... 🇺🇸" : "Create account"}</span>
      </Button>
    </form>
  )
}
