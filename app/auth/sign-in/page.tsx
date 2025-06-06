"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabaseClient } from "@/lib/supabase/client"
import SignInForm from "@/components/auth/sign-in-form"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignInPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [prefillEmail, setPrefillEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = supabaseClient()
        if (!supabase) {
          setIsLoading(false)
          return
        }

        const { data } = await supabase.auth.getSession()
        if (data.session) {
          setIsLoggedIn(true)
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Error checking session:", error)
        setIsLoading(false)
      }
    }

    // Check for error messages and email from header login
    const loginError = sessionStorage.getItem("loginError")
    const loginEmail = sessionStorage.getItem("loginEmail")

    if (loginError) {
      setErrorMessage(loginError)
      sessionStorage.removeItem("loginError")
    }

    if (loginEmail) {
      setPrefillEmail(loginEmail)
      sessionStorage.removeItem("loginEmail")
    }

    checkSession()
  }, [])

  if (isLoading) {
    return <div className="container mx-auto py-10 text-gray-900 dark:text-white">Loading...</div>
  }

  if (isLoggedIn) {
    return (
      <div className="container mx-auto py-10">
        <div className="max-w-md mx-auto">
          <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
            <AlertDescription className="text-green-800 dark:text-green-300">
              You are already logged in.{" "}
              <Link href="/profile" className="font-medium underline">
                Go to your profile
              </Link>{" "}
              or{" "}
              <Link href="/" className="font-medium underline">
                return to home
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back!</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Don't have an account yet?{" "}
          <Link
            href="/auth/sign-up"
            className="font-medium text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign up
          </Link>
        </p>
      </div>

      {errorMessage && (
        <Alert className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
          <AlertDescription className="text-red-800 dark:text-red-300">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <SignInForm prefillEmail={prefillEmail} />
    </>
  )
}
