"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

interface SignInFormProps {
  prefillEmail?: string
  prefillPassword?: string
  mfaRequired?: boolean
}

export default function SignInForm({ prefillEmail = "", prefillPassword = "", mfaRequired = false }: SignInFormProps) {
  const [email, setEmail] = useState(prefillEmail)
  const [password, setPassword] = useState(prefillPassword)
  const [mfaCode, setMfaCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showMfaInput, setShowMfaInput] = useState(mfaRequired)

  const { signIn } = useAuth()
  const router = useRouter()

  console.log("🎯 SignInForm rendered with:")
  console.log("📧 Prefill email:", prefillEmail)
  console.log("🔒 Prefill password:", !!prefillPassword)
  console.log("🔐 MFA required:", mfaRequired)
  console.log("🔐 Show MFA input:", showMfaInput)

  useEffect(() => {
    setEmail(prefillEmail)
    setPassword(prefillPassword)
    setShowMfaInput(mfaRequired)

    console.log("🔄 SignInForm useEffect:")
    console.log("📧 Setting email to:", prefillEmail)
    console.log("🔐 Setting showMfaInput to:", mfaRequired)
  }, [prefillEmail, prefillPassword, mfaRequired])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("🚀 === SIGN-IN FORM SUBMIT ===")
    console.log("📧 Email:", email)
    console.log("🔒 Password length:", password.length)
    console.log("🔐 MFA Code:", mfaCode)
    console.log("🔐 Show MFA Input:", showMfaInput)

    try {
      if (!email || !password) {
        setError("Email and password are required")
        return
      }

      if (showMfaInput && !mfaCode) {
        setError("Verification code is required")
        return
      }

      console.log("🔑 Calling signIn with MFA code:", !!mfaCode)
      const result = await signIn(email, password, mfaCode || undefined)
      console.log("🔑 SignIn result:", JSON.stringify(result, null, 2))

      if (result.error) {
        console.log("❌ SignIn error:", result.error)
        setError(result.error.message || "An error occurred during sign in")
        return
      }

      if (result.mfaRequired && !showMfaInput) {
        console.log("🔐 MFA required - showing MFA input")
        setShowMfaInput(true)
        setError("")
        return
      }

      if (result.data?.user) {
        console.log("✅ Sign in successful!")
        // Clear any stored MFA data
        sessionStorage.removeItem("mfaEmail")
        sessionStorage.removeItem("mfaRequired")

        toast({
          title: "Success",
          description: "You have been signed in successfully",
        })

        router.push("/profile")
      }
    } catch (error: any) {
      console.error("💥 Sign in error:", error)
      setError(error.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
      console.log("🏁 === SIGN-IN FORM SUBMIT END ===")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
            <AlertDescription className="text-red-800 dark:text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isLoading || showMfaInput}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading || showMfaInput}
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>

        {showMfaInput && (
          <div className="space-y-2">
            <Label htmlFor="mfaCode">Verification Code</Label>
            <Input
              id="mfaCode"
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              disabled={isLoading}
              className="w-full text-center text-lg tracking-widest"
              autoComplete="one-time-code"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {showMfaInput ? "Verifying..." : "Signing in..."}
            </>
          ) : showMfaInput ? (
            "Verify & Sign In"
          ) : (
            "Sign In"
          )}
        </Button>

        {!showMfaInput && (
          <div className="text-center">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot your password?
            </Link>
          </div>
        )}

        {showMfaInput && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setShowMfaInput(false)
                setMfaCode("")
                setError("")
                // Clear MFA session data
                sessionStorage.removeItem("mfaEmail")
                sessionStorage.removeItem("mfaRequired")
              }}
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
            >
              Back to login
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
