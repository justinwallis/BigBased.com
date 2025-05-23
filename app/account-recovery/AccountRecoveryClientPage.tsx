"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Loader2, KeyRound, ArrowLeft, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { initiateAccountRecovery } from "@/app/actions/recovery-actions"
import Link from "next/link"

export function AccountRecoveryClientPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    try {
      setIsSubmitting(true)
      const result = await initiateAccountRecovery(email)

      if (result.success) {
        setSuccess(result.message || "Recovery instructions sent to your email")

        // For demo purposes only, store the token
        if (result.debug) {
          setRecoveryToken(result.debug.token)
        }
      } else {
        setError(result.error || "Failed to initiate account recovery")
      }
    } catch (err) {
      console.error("Error initiating account recovery:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10 flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="flex justify-start mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Account Recovery
            </CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to recover your account.
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
              <div className="space-y-4">
                <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>

                <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-md p-4 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Check your email</h3>
                      <p className="text-sm mt-1">
                        We've sent recovery instructions to <strong>{email}</strong>. Please check your inbox and spam
                        folder.
                      </p>
                    </div>
                  </div>
                </div>

                {/* For demo purposes only */}
                {recoveryToken && (
                  <div className="mt-4 p-4 border border-dashed rounded-md">
                    <p className="text-sm font-medium mb-2">Demo Mode: Recovery Token</p>
                    <div className="bg-gray-100 p-2 rounded dark:bg-gray-800 overflow-x-auto">
                      <code className="text-xs">{recoveryToken}</code>
                    </div>
                    <p className="text-xs mt-2 text-muted-foreground">
                      In a real application, this token would be sent via email.
                    </p>
                    <div className="mt-3">
                      <Button size="sm" asChild>
                        <Link href={`/account-recovery/verify?token=${recoveryToken}`}>Continue Recovery Process</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your account email"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Recover Account"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
