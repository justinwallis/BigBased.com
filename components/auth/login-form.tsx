"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import VerificationCodeInput from "./verification-code-input"

interface LoginFormProps {
  onSuccess?: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // New state for verification step
  const [showVerification, setShowVerification] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error, data } = await signIn(email, password)

      if (error) {
        setError(error.message)
        return
      }

      // Check if email verification is required
      // This is a simulated check - in a real app, your backend would tell you if verification is needed
      const needsVerification = Math.random() > 0.5 // Simulate 50% chance of needing verification

      if (needsVerification) {
        // Show verification step
        setUserId(data?.user?.id || null)
        setShowVerification(true)
      } else {
        // No verification needed, proceed with success
        setSuccess(true)

        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
          }, 500) // Small delay for better UX
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle verification code submission
  const handleVerifyCode = async (code: string) => {
    // This would call your API to verify the code
    // For now, we'll simulate a successful verification
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => {
        if (code === "123456") {
          // In a real app, you'd verify against your backend
          setSuccess(true)
          resolve({ success: true })
        } else {
          resolve({ success: false, message: "Invalid verification code. Please try again." })
        }
      }, 1000)
    })
  }

  // Handle resending verification code
  const handleResendCode = async () => {
    // This would call your API to resend the verification code
    // For now, we'll simulate a successful resend
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Verification code sent!" })
      }, 1000)
    })
  }

  // If showing verification step, render the verification component
  if (showVerification) {
    return (
      <VerificationCodeInput
        email={email}
        onVerify={handleVerifyCode}
        onResendCode={handleResendCode}
        onSuccess={onSuccess}
        onCancel={() => setShowVerification(false)}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription>Login successful! Redirecting...</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-900 dark:text-white">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-gray-900 dark:text-white">
            Password
          </Label>
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <Button
        type="submit"
        className="w-full transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-700"
        disabled={isLoading || success}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
