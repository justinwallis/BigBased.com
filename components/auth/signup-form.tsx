"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, X, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createProfile } from "@/app/actions/profile-actions"
import { Checkbox } from "@/components/ui/checkbox"
import Script from "next/script"

interface SignupFormProps {
  onSuccess?: () => void
}

// Define the window interface to include the recaptcha object
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
      render: (container: string | HTMLElement, parameters: any) => number
      reset: (widgetId?: number) => void
      getResponse: (widgetId?: number) => string
    }
    onRecaptchaLoad: () => void
    recaptchaWidgetId: number
  }
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const recaptchaWidgetId = useRef<number | null>(null)

  // Password requirements
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  // Initialize reCAPTCHA when the component mounts
  useEffect(() => {
    // Define the callback function for when reCAPTCHA script loads
    window.onRecaptchaLoad = () => {
      setRecaptchaLoaded(true)
      if (recaptchaRef.current) {
        recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", // This is Google's test key - replace with your actual key in production
          theme: "light",
          size: "normal",
          callback: (response: string) => {
            if (response) {
              setRecaptchaVerified(true)
              setError(null)
            }
          },
          "expired-callback": () => {
            setRecaptchaVerified(false)
          },
          "error-callback": () => {
            setError("reCAPTCHA error occurred. Please try again.")
            setRecaptchaVerified(false)
          },
        })
      }
    }

    // Clean up
    return () => {
      delete window.onRecaptchaLoad
    }
  }, [])

  // Check password requirements
  useEffect(() => {
    setPasswordRequirements({
      length: password.length >= 10,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    })
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!agreedToTerms) {
      setError("You must agree to the terms and privacy policy")
      return
    }

    if (!recaptchaVerified) {
      setError("Please complete the reCAPTCHA verification")
      return
    }

    // Check if all password requirements are met
    const allRequirementsMet = Object.values(passwordRequirements).every((req) => req)
    if (!allRequirementsMet) {
      setError("Please meet all password requirements")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data, error } = await signUp(email, password)

      if (error) {
        setError(error.message)
        return
      }

      if (data?.user) {
        // Create a profile for the user
        try {
          await createProfile({
            id: data.user.id,
            email: data.user.email || "",
            username: data.user.email?.split("@")[0] || "",
          })
        } catch (profileError) {
          console.error("Error creating profile:", profileError)
          // Continue anyway, as the auth was successful
        }

        setSuccess(true)

        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Load reCAPTCHA script */}
      <Script
        src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
        strategy="lazyOnload"
      />

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
            <AlertDescription>Success! Check your email for a confirmation link.</AlertDescription>
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
          <Label htmlFor="password" className="text-gray-900 dark:text-white">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />

          <div className="mt-2 space-y-1 text-sm">
            <p className="font-medium text-gray-700 dark:text-gray-300">Password requirements:</p>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center gap-1">
                {passwordRequirements.length ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={
                    passwordRequirements.length
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }
                >
                  At least 10 characters
                </span>
              </div>
              <div className="flex items-center gap-1">
                {passwordRequirements.uppercase ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={
                    passwordRequirements.uppercase
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }
                >
                  Uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-1">
                {passwordRequirements.lowercase ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={
                    passwordRequirements.lowercase
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }
                >
                  Lowercase letter
                </span>
              </div>
              <div className="flex items-center gap-1">
                {passwordRequirements.number ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={
                    passwordRequirements.number
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }
                >
                  Number
                </span>
              </div>
              <div className="flex items-center gap-1">
                {passwordRequirements.special ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={
                    passwordRequirements.special
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }
                >
                  Special character
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* reCAPTCHA */}
        <div className="flex justify-center my-4">
          <div ref={recaptchaRef} className="g-recaptcha"></div>
        </div>

        {/* Terms and Privacy Policy */}
        <div className="flex items-start space-x-2 mt-4">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-1"
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white"
            >
              I agree to the Terms of Service and Privacy Policy
            </label>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              By creating an account, you agree to our{" "}
              <a href="/terms" className="text-primary hover:underline dark:text-gray-300">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline dark:text-gray-300">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-700"
          disabled={isLoading || success || !agreedToTerms || !recaptchaVerified}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </>
  )
}
