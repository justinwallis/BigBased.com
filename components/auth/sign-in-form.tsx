"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signIn } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error, data } = await signIn(email, password)

      if (error) {
        setError(error instanceof Error ? error.message : String(error))
        setLoading(false)
      } else {
        setSuccess(true)
        // Store that user has logged in before
        localStorage.setItem("hasLoggedInBefore", "true")
        // Redirect to profile or dashboard after successful login
        setTimeout(() => {
          router.push("/profile")
          router.refresh() // Refresh to update auth state
        }, 1000)
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6 max-w-sm mx-auto" onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive" className="dark:bg-gray-800 dark:border-gray-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="dark:text-white">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="dark:bg-gray-800 dark:border-gray-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="dark:text-white">Sign in successful! Redirecting...</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-white">
            Password
          </Label>
          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="w-full text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        <span className="text-white dark:text-black">{loading ? "Loading... 🇺🇸" : "Sign in"}</span>
      </Button>
    </form>
  )
}
