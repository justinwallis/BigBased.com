"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignInForm() {
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/profile"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error, data } = await signIn(email, password)

      if (error) {
        setError(error.message || "Failed to sign in")
        return
      }

      if (data?.session) {
        // Store remember me preference if checked
        if (rememberMe) {
          localStorage.setItem("rememberAuth", "true")
        } else {
          localStorage.removeItem("rememberAuth")
        }

        // Force a small delay to ensure the session is properly set
        setTimeout(() => {
          console.log("Authentication successful, redirecting to:", redirectUrl)
          router.push(redirectUrl)
        }, 500)
      } else {
        setError("Authentication failed. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="dark:text-white">{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="dark:text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className="dark:text-white !bg-gray-50 dark:!bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="dark:text-white">
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline dark:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
              className="dark:text-white !bg-gray-50 dark:!bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="flex items-center space-x-2 my-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="dark:border-gray-500"
            />
            <Label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
            >
              Remember me
            </Label>
          </div>
          <Button type="submit" disabled={isLoading} className="dark:text-black">
            {isLoading ? <span className="text-white dark:text-white">Loading... 🇺🇸</span> : "Sign In 🇺🇸"}
          </Button>
        </div>
      </form>
    </div>
  )
}
