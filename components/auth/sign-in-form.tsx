"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, KeyRound, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignInForm() {
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/profile"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [mfaCode, setMfaCode] = useState("")
  const [mfaRequired, setMfaRequired] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [challengeId, setChallengeId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("=== Form Submit ===")
      console.log("Email:", email)
      console.log("Has Password:", !!password)
      console.log("MFA Required:", mfaRequired)
      console.log("Has MFA Code:", !!mfaCode)

      if (!email || !password) {
        setError("Email and password are required")
        setIsLoading(false)
        return
      }

      // If MFA is required and we have a code, verify it
      if (mfaRequired && mfaCode) {
        if (mfaCode.length !== 6) {
          setError("Please enter a valid 6-digit code")
          setIsLoading(false)
          return
        }

        console.log("Verifying MFA code:", mfaCode)
        console.log("Factor ID:", factorId)
        console.log("Challenge ID:", challengeId)

        // Attempt MFA verification
        const result = await signIn(email, password, mfaCode, factorId, challengeId)
        console.log("MFA verification result:", result)

        if (result.error) {
          setError(result.error.message || "Invalid verification code")
          setIsLoading(false)
          return
        }

        // If we have a successful session after MFA
        if (result.data?.session) {
          console.log("MFA verification successful!")

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
          }, 500)
        } else {
          setError("Authentication failed after MFA verification")
          setIsLoading(false)
        }

        return
      }

      // Initial sign in attempt
      const result = await signIn(email, password)
      console.log("Sign in result:", result)

      if (result.mfaRequired) {
        console.log("MFA is required")
        setMfaRequired(true)
        setFactorId(result.factorId || null)
        setChallengeId(result.challengeId || null)
        setIsLoading(false)
        return
      }

      if (result.error) {
        setError(result.error.message || "Failed to sign in")
        setIsLoading(false)
        return
      }

      // If we have a successful session
      if (result.data?.session) {
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
          {!mfaRequired ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email" className="dark:text-white flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
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
                  disabled={isLoading || mfaRequired}
                  className="dark:text-white dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="dark:text-white flex items-center gap-2">
                    <KeyRound className="h-4 w-4" /> Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline dark:text-blue-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoCapitalize="none"
                    autoComplete="current-password"
                    autoCorrect="off"
                    disabled={isLoading || mfaRequired}
                    className="dark:text-white dark:bg-gray-800 dark:border-gray-700 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

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
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                  <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium dark:text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mfa-code" className="dark:text-white sr-only">
                  Authentication Code
                </Label>
                <Input
                  id="mfa-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="000000"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  autoComplete="one-time-code"
                  disabled={isLoading}
                  className="dark:text-white dark:bg-gray-800 dark:border-gray-700 text-center text-lg font-mono tracking-widest"
                  autoFocus
                />
              </div>
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setMfaRequired(false)}
                  className="text-primary hover:underline dark:text-blue-400"
                >
                  Back to login
                </button>
              </div>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="dark:text-black">
            {isLoading ? (
              <>
                <span className="mr-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </span>
                {mfaRequired ? "Verifying..." : "Signing In..."}
              </>
            ) : mfaRequired ? (
              "Verify Code"
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
