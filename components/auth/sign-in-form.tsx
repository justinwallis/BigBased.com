"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"

function SignInFormComponent() {
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/profile"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mfaCode, setMfaCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [showMfaInput, setShowMfaInput] = useState(false)
  const [mfaRequired, setMfaRequired] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("=== Form Submit ===")
      console.log("Email:", email)
      console.log("Has Password:", !!password)
      console.log("Has MFA Code:", !!mfaCode)
      console.log("Show MFA Input:", showMfaInput)

      // First, check if MFA is required for this user
      if (!showMfaInput) {
        // Try initial sign in to check if MFA is required
        const checkMfaResponse = await fetch("/api/auth/check-mfa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        const checkMfaResult = await checkMfaResponse.json()
        console.log("MFA Check Result:", checkMfaResult)

        if (checkMfaResult.mfaRequired) {
          console.log("MFA required, showing MFA input")
          setMfaRequired(true)
          setShowMfaInput(true)
          setError("Please enter your 6-digit verification code")
          setIsLoading(false)
          return
        }
      }

      // If MFA code is provided, verify it first
      if (mfaCode && showMfaInput) {
        console.log("Verifying MFA code...")
        const mfaVerifyResponse = await fetch("/api/auth/verify-mfa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, token: mfaCode }),
        })

        const mfaVerifyResult = await mfaVerifyResponse.json()
        console.log("MFA Verify Result:", mfaVerifyResult)

        if (!mfaVerifyResult.success) {
          setError(mfaVerifyResult.error || "Invalid MFA code")
          setIsLoading(false)
          return
        }

        console.log("MFA verified successfully, proceeding with sign in...")
      }

      // Proceed with Supabase sign in
      console.log("Proceeding with Supabase sign in...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Supabase sign in result:", { data: !!data, error })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      // Success - redirect
      if (data?.session) {
        console.log("Sign in successful!")

        // Store remember me preference if checked
        if (rememberMe) {
          localStorage.setItem("rememberAuth", "true")
        } else {
          localStorage.removeItem("rememberAuth")
        }

        // Force a small delay to ensure the session is properly set
        setTimeout(() => {
          console.log("Authentication successful, redirecting to:", redirectUrl)
          router.push(redirectUrl)
          router.refresh()
        }, 500)
      } else {
        setError("Authentication failed. Please try again.")
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error("Form submit error:", err)
      setError(err.message || "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  const handleMfaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6) // Only allow digits, max 6
    setMfaCode(value)
  }

  return (
    <div className="grid gap-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="dark:text-white">{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="dark:text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || showMfaInput}
              className="dark:text-white dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="dark:text-white">
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline dark:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading || showMfaInput}
              className="dark:text-white dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          {showMfaInput && (
            <div className="grid gap-2">
              <Label htmlFor="mfaCode" className="dark:text-white">
                Verification Code
              </Label>
              <Input
                id="mfaCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="6-digit code"
                value={mfaCode}
                onChange={handleMfaCodeChange}
                required
                autoFocus
                autoComplete="one-time-code"
                disabled={isLoading}
                onKeyDown={handleKeyDown}
                className="dark:text-white dark:bg-gray-800 dark:border-gray-700 text-center text-lg tracking-widest"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter the 6-digit code from your authenticator app
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMfaInput(false)
                  setMfaRequired(false)
                  setMfaCode("")
                  setError(null)
                }}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                ← Back to login
              </Button>
            </div>
          )}

          {!showMfaInput && (
            <div className="flex items-center space-x-2 my-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="dark:border-gray-500"
              />
              <Label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
              >
                Remember me
              </Label>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="dark:text-black">
            {isLoading ? "Loading... 🇺🇸" : showMfaInput ? "Verify & Sign In" : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  )
}

// Default export
export default SignInFormComponent

// Named export for compatibility
export { SignInFormComponent as SignInForm }
