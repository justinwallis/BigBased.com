"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Loader2, KeyRound, ArrowLeft, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  verifyRecoveryToken,
  getSecurityQuestions,
  verifySecurityQuestions,
  resetPasswordAfterRecovery,
} from "@/app/actions/recovery-actions"
import Link from "next/link"

export function VerifyRecoveryTokenClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [recoveryMethodId, setRecoveryMethodId] = useState<number | null>(null)
  const [methodType, setMethodType] = useState<string | null>(null)
  const [step, setStep] = useState<"verifying" | "security_questions" | "reset_password">("verifying")

  // Security questions state
  const [questions, setQuestions] = useState<{ id: number; question_text: string }[]>([])
  const [answers, setAnswers] = useState<{ questionId: number; answer: string }[]>([])
  const [isVerifyingAnswers, setIsVerifyingAnswers] = useState(false)
  const [attemptsRemaining, setAttemptsRemaining] = useState(3)

  // Password reset state
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  // Verify the token on mount
  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setError("Invalid recovery token")
        setIsLoading(false)
        return
      }

      try {
        const result = await verifyRecoveryToken(token)

        if (result.success && result.data) {
          setUserId(result.data.userId)
          setRecoveryMethodId(result.data.recoveryMethodId)
          setMethodType(result.data.methodType)

          // If security questions, load them
          if (result.data.methodType === "security_questions") {
            const questionsResult = await getSecurityQuestions(result.data.userId, result.data.recoveryMethodId)
            if (questionsResult.success && questionsResult.data) {
              setQuestions(questionsResult.data)
              setAnswers(questionsResult.data.map((q) => ({ questionId: q.id, answer: "" })))
              setStep("security_questions")
            } else {
              setError(questionsResult.error || "Failed to load security questions")
            }
          } else {
            // For demo purposes, we'll just show the password reset step
            setStep("reset_password")
          }
        } else {
          setError(result.error || "Invalid or expired recovery token")
        }
      } catch (err) {
        console.error("Error verifying recovery token:", err)
        setError("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [token])

  // Handle security questions submission
  const handleVerifySecurityQuestions = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate answers
    const isValid = answers.every((a) => a.answer.trim())
    if (!isValid) {
      setError("Please answer all security questions")
      return
    }

    try {
      setIsVerifyingAnswers(true)
      const result = await verifySecurityQuestions(token!, answers)

      if (result.success) {
        setSuccess("Security questions verified successfully")
        setStep("reset_password")
      } else {
        setError(result.error || "Failed to verify security questions")
        if (result.attemptsRemaining !== undefined) {
          setAttemptsRemaining(result.attemptsRemaining)
        }
      }
    } catch (err) {
      console.error("Error verifying security questions:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsVerifyingAnswers(false)
    }
  }

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setIsResettingPassword(true)
      const result = await resetPasswordAfterRecovery(token!, newPassword)

      if (result.success) {
        setSuccess("Password reset successfully")
        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(result.error || "Failed to reset password")
      }
    } catch (err) {
      console.error("Error resetting password:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsResettingPassword(false)
    }
  }

  // Update answer for a question
  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => prev.map((a) => (a.questionId === questionId ? { ...a, answer } : a)))
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Verifying recovery token...</p>
        </div>
      </div>
    )
  }

  // Render error state
  if (error && step === "verifying") {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <div className="flex justify-start mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/account-recovery">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Account Recovery
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Account Recovery
              </CardTitle>
              <CardDescription>There was a problem with your recovery token.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/account-recovery">Try Again</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Render security questions step
  if (step === "security_questions") {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <div className="flex justify-start mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/account-recovery">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Account Recovery
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verify Security Questions
              </CardTitle>
              <CardDescription>Please answer your security questions to verify your identity.</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                    {attemptsRemaining > 0 && (
                      <span className="block mt-1">
                        Attempts remaining: <strong>{attemptsRemaining}</strong>
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleVerifySecurityQuestions} className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <Label htmlFor={`question-${question.id}`}>{question.question_text}</Label>
                    <Input
                      id={`question-${question.id}`}
                      value={answers.find((a) => a.questionId === question.id)?.answer || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Enter your answer"
                      required
                      disabled={isVerifyingAnswers}
                    />
                  </div>
                ))}

                <Button type="submit" className="w-full" disabled={isVerifyingAnswers}>
                  {isVerifyingAnswers ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Answers"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Render password reset step
  if (step === "reset_password") {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <div className="flex justify-start mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/account-recovery">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Account Recovery
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Reset Password
              </CardTitle>
              <CardDescription>
                Create a new password for your account. Make sure it's secure and different from your previous password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success ? (
                <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription>{success} Redirecting to login page...</AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      disabled={isResettingPassword}
                      minLength={8}
                    />
                    <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      disabled={isResettingPassword}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isResettingPassword}>
                    {isResettingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
