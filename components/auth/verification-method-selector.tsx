"use client"

import { logAuthEvent } from "@/app/actions/auth-log-actions"
import { AUTH_EVENTS, AUTH_STATUS } from "@/app/constants/auth-log-constants"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface VerificationMethodSelectorProps {
  email: string
}

export function VerificationMethodSelector({ email }: VerificationMethodSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const session = useSession()

  const handleSignIn = async (method: "email" | "otp") => {
    setIsLoading(true)
    try {
      const signInResult = await signIn(method, {
        email,
        redirect: false,
      })

      if (signInResult?.error) {
        toast({
          title: "Error signing in",
          description: signInResult.error,
          variant: "destructive",
        })
        logAuthEvent(AUTH_EVENTS.SIGN_IN_FAILED, {
          status: AUTH_STATUS.FAILED,
          email: email,
          method: method,
          error: signInResult.error,
        })
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a verification code.",
        })
        logAuthEvent(AUTH_EVENTS.SIGN_IN_REQUESTED, {
          status: AUTH_STATUS.PENDING,
          email: email,
          method: method,
        })
        router.push("/verify")
      }
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      })
      logAuthEvent(AUTH_EVENTS.SIGN_IN_FAILED, {
        status: AUTH_STATUS.FAILED,
        email: email,
        method: method,
        error: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Choose Verification Method</CardTitle>
        <CardDescription>How would you like to verify your email?</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="outline" disabled={isLoading} onClick={() => handleSignIn("email")}>
          Send Email Verification Code
        </Button>
        <Button variant="outline" disabled={isLoading} onClick={() => handleSignIn("otp")}>
          Send OTP to Email
        </Button>
      </CardContent>
    </Card>
  )
}
