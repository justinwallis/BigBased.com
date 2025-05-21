"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { register } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface State {
  message: string | null
  success: boolean
  loading: boolean
}

interface PasswordStrength {
  score: number
  hasMinLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

const initialState: State = {
  message: null,
  success: false,
  loading: false,
}

const initialPasswordStrength: PasswordStrength = {
  score: 0,
  hasMinLength: false,
  hasUppercase: false,
  hasLowercase: false,
  hasNumber: false,
  hasSpecialChar: false,
}

export default function SignUpForm() {
  const [state, setState] = useState<State>(initialState)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(initialPasswordStrength)
  const router = useRouter()

  // Check password strength
  useEffect(() => {
    const strength: PasswordStrength = {
      score: 0,
      hasMinLength: password.length >= 10,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    }

    // Calculate score (1 point for each criteria met)
    strength.score = [
      strength.hasMinLength,
      strength.hasUppercase,
      strength.hasLowercase,
      strength.hasNumber,
      strength.hasSpecialChar,
    ].filter(Boolean).length

    setPasswordStrength(strength)

    // Check if passwords match
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    }
  }, [password, confirmPassword])

  // Get color for password strength indicator
  const getStrengthColor = () => {
    if (passwordStrength.score <= 2) return "bg-red-500"
    if (passwordStrength.score <= 3) return "bg-yellow-500"
    if (passwordStrength.score <= 4) return "bg-blue-500"
    return "bg-green-500"
  }

  // Check if form is valid for submission
  const isFormValid = () => {
    return passwordStrength.score >= 4 && passwordsMatch && password.length > 0 && confirmPassword.length > 0
  }

  async function handleSubmit(formData: FormData) {
    // Client-side validation before submission
    if (!isFormValid()) {
      setState({
        message: "Please ensure your password meets all requirements and passwords match.",
        success: false,
        loading: false,
      })
      return
    }

    setState({ ...state, loading: true, message: null })

    try {
      const result = await register(formData)

      if (result?.error) {
        setState({ message: result.error, success: false, loading: false })
      } else if (result?.success) {
        setState({
          message: "Account created successfully! Please check your email to verify your account.",
          success: true,
          loading: false,
        })
        // Redirect to sign-in page after successful registration
        setTimeout(() => {
          router.push("/auth/sign-in")
        }, 3000)
      } else {
        setState({ message: "An unknown error occurred", success: false, loading: false })
      }
    } catch (error) {
      setState({
        message: error instanceof Error ? error.message : "An unknown error occurred",
        success: false,
        loading: false,
      })
    }
  }

  return (
    <form className="space-y-6" action={handleSubmit}>
      {state.message && (
        <Alert variant={state.success ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />

        {/* Password strength indicator */}
        {password.length > 0 && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <Progress value={passwordStrength.score * 20} className={getStrengthColor()} />
              <p className="text-xs text-gray-500 mt-1">
                Password strength:{" "}
                {passwordStrength.score <= 2
                  ? "Weak"
                  : passwordStrength.score <= 3
                    ? "Fair"
                    : passwordStrength.score <= 4
                      ? "Good"
                      : "Strong"}
              </p>
            </div>

            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                {passwordStrength.hasMinLength ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                )}
                <span className="text-xs">At least 10 characters</span>
              </li>
              <li className="flex items-center gap-2">
                {passwordStrength.hasUppercase ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                )}
                <span className="text-xs">At least one uppercase letter</span>
              </li>
              <li className="flex items-center gap-2">
                {passwordStrength.hasLowercase ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                )}
                <span className="text-xs">At least one lowercase letter</span>
              </li>
              <li className="flex items-center gap-2">
                {passwordStrength.hasNumber ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                )}
                <span className="text-xs">At least one number</span>
              </li>
              <li className="flex items-center gap-2">
                {passwordStrength.hasSpecialChar ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                )}
                <span className="text-xs">At least one special character</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full ${confirmPassword && !passwordsMatch ? "border-red-500" : ""}`}
        />
        {confirmPassword && !passwordsMatch && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
      </div>

      <Button type="submit" className="w-full" disabled={state.loading || !isFormValid()}>
        {state.loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
