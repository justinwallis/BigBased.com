"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
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

  return (
    <form
      className="space-y-4"
      action={async (formData) => {
        // Client-side validation before submission
        if (!isFormValid()) {
          setState({
            message: "Please ensure your password meets all requirements and passwords match.",
            success: false,
          })
          return
        }

        const result = await register(formData)

        if (result?.error) {
          setState({ message: result.error, success: false })
        } else if (result?.success) {
          setState({
            message: "Account created successfully! Please check your email to verify your account.",
            success: true,
          })
          // Redirect to sign-in page after successful registration
          setTimeout(() => {
            router.push("/auth/sign-in")
          }, 3000)
        }
      }}
    >
      {state.message && (
        <Alert variant={state.success ? "default" : "destructive"} className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Password strength indicator */}
        {password.length > 0 && (
          <div className="mt-2 space-y-2">
            <div className="space-y-1">
              <Progress value={passwordStrength.score * 20} className={getStrengthColor()} />
              <p className="text-xs text-gray-500">
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

            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                {passwordStrength.hasMinLength ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs">At least 10 characters</span>
              </li>
              <li className="flex items-center gap-2">
                {passwordStrength.hasUppercase ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs">At least one uppercase letter</span>
              </li>
              <li className="flex items-center gap-2">
                {passwordStrength.hasLowercase ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs">At least one lowercase letter</span>
              </li>
              <li className="flex items-center gap-2">
                {passwordStrength.hasNumber ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs">At least one number</span>
              </li>
              <li className="flex items-center gap-2">
                {passwordStrength.hasSpecialChar ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs">At least one special character</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={confirmPassword && !passwordsMatch ? "border-red-500" : ""}
        />
        {confirmPassword && !passwordsMatch && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
      </div>

      <SubmitButton disabled={!isFormValid()} />
    </form>
  )
}

function SubmitButton({ disabled = false }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending || disabled}>
      {pending ? "Creating account..." : "Create account"}
    </Button>
  )
}
