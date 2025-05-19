"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VerificationCodeInputProps {
  email: string
  onVerify: (code: string) => Promise<{ success: boolean; message?: string }>
  onResendCode: () => Promise<{ success: boolean; message?: string }>
  onSuccess?: () => void
  onCancel?: () => void
}

export default function VerificationCodeInput({
  email,
  onVerify,
  onResendCode,
  onSuccess,
  onCancel,
}: VerificationCodeInputProps) {
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resendSuccess, setResendSuccess] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Handle countdown for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return

    const timer = setTimeout(() => {
      setResendCooldown(resendCooldown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [resendCooldown])

  const handleVerify = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const result = await onVerify(verificationCode)

      if (!result.success) {
        setError(result.message || "Invalid verification code. Please try again.")
        return
      }

      setSuccess(true)

      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setResendSuccess(null)
    setError(null)

    try {
      const result = await onResendCode()

      if (!result.success) {
        setError(result.message || "Failed to resend code. Please try again later.")
        return
      }

      setResendSuccess("Verification code sent! Please check your email.")
      setResendCooldown(60) // 60 second cooldown
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="space-y-4 py-2">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription>Email verified successfully!</AlertDescription>
        </Alert>
      )}

      {resendSuccess && !error && !success && (
        <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
          <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription>{resendSuccess}</AlertDescription>
        </Alert>
      )}

      <div className="text-center mb-4">
        <p className="text-gray-700 dark:text-gray-300">We've sent a verification code to:</p>
        <p className="font-medium text-gray-900 dark:text-white">{email}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Please check your inbox and enter the code below
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="verification-code" className="text-gray-900 dark:text-white">
          Verification Code
        </Label>
        <Input
          id="verification-code"
          type="text"
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
          className="text-center text-lg tracking-wider border-gray-300 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          maxLength={6}
          autoComplete="one-time-code"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying || success || verificationCode.length !== 6}
          className="w-full transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-700"
        >
          {isVerifying ? "Verifying..." : "Verify Email"}
        </Button>

        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="ghost"
            onClick={handleResendCode}
            disabled={isResending || resendCooldown > 0 || success}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            {resendCooldown > 0 ? (
              <span className="flex items-center">
                <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                Resend in {resendCooldown}s
              </span>
            ) : (
              <span className="flex items-center">
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Resend Code
              </span>
            )}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isVerifying || success}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
