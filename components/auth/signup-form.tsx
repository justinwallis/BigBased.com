"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, X, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createProfile } from "@/app/actions/profile-actions"
import { Checkbox } from "@/components/ui/checkbox"

interface SignupFormProps {
  onSuccess?: () => void
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState("")
  const [captchaChallenge, setCaptchaChallenge] = useState("")

  // Password requirements
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  // Generate simple CAPTCHA challenge
  useEffect(() => {
    const generateCaptcha = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
      let result = ""
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      setCaptchaChallenge(result)
    }

    generateCaptcha()
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

    if (!captchaVerified) {
      setError("Please verify the CAPTCHA")
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

  const verifyCaptcha = () => {
    if (captchaValue === captchaChallenge) {
      setCaptchaVerified(true)
      setError(null)
    } else {
      setCaptchaVerified(false)
      setError("CAPTCHA verification failed. Please try again.")
      // Generate a new CAPTCHA
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
      let result = ""
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      setCaptchaChallenge(result)
      setCaptchaValue("")
    }
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
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>Success! Check your email for a confirmation link.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
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
              <span className={passwordRequirements.length ? "text-green-600" : "text-gray-500"}>
                At least 10 characters
              </span>
            </div>
            <div className="flex items-center gap-1">
              {passwordRequirements.uppercase ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <X className="h-3.5 w-3.5 text-red-500" />
              )}
              <span className={passwordRequirements.uppercase ? "text-green-600" : "text-gray-500"}>
                Uppercase letter
              </span>
            </div>
            <div className="flex items-center gap-1">
              {passwordRequirements.lowercase ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <X className="h-3.5 w-3.5 text-red-500" />
              )}
              <span className={passwordRequirements.lowercase ? "text-green-600" : "text-gray-500"}>
                Lowercase letter
              </span>
            </div>
            <div className="flex items-center gap-1">
              {passwordRequirements.number ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <X className="h-3.5 w-3.5 text-red-500" />
              )}
              <span className={passwordRequirements.number ? "text-green-600" : "text-gray-500"}>Number</span>
            </div>
            <div className="flex items-center gap-1">
              {passwordRequirements.special ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <X className="h-3.5 w-3.5 text-red-500" />
              )}
              <span className={passwordRequirements.special ? "text-green-600" : "text-gray-500"}>
                Special character
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CAPTCHA */}
      {!captchaVerified ? (
        <div className="space-y-2 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
          <Label htmlFor="captcha">CAPTCHA Verification</Label>
          <div className="flex items-center justify-center mb-2">
            <div className="bg-white dark:bg-gray-700 p-2 rounded-md select-none font-mono text-lg tracking-widest">
              {captchaChallenge.split("").map((char, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    transform: `rotate(${Math.random() * 20 - 10}deg)`,
                    margin: "0 2px",
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
          <div className="flex space-x-2">
            <Input
              id="captcha"
              type="text"
              placeholder="Enter the code above"
              value={captchaValue}
              onChange={(e) => setCaptchaValue(e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={verifyCaptcha} className="whitespace-nowrap">
              Verify
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-3 border rounded-md bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
          <span className="text-green-700 dark:text-green-400">CAPTCHA verified</span>
        </div>
      )}

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
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the Terms of Service and Privacy Policy
          </label>
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full transition-all duration-300 hover:bg-gray-800"
        disabled={isLoading || success || !agreedToTerms || !captchaVerified}
      >
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
