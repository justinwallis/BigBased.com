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
  const [prefillPassword, setPrefillPassword] = useState("")
  const [mfaRequired, setMfaRequired] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log("🔍 === SIGN-IN PAGE LOADING ===")

    const checkSession = async () => {
      try {
        const supabase = supabaseClient()
        if (!supabase) {
          console.log("❌ No Supabase client")
          setIsLoading(false)
          return
        }

        const { data } = await supabase.auth.getSession()
        if (data.session) {
          console.log("✅ User already logged in")
          setIsLoggedIn(true)
        }
        setIsLoading(false)
      } catch (error) {
        console.error("❌ Error checking session:", error)
        setIsLoading(false)
      }
    }

    // Check URL parameters
    const mfaParam = searchParams.get("mfa")
    console.log("🔍 URL mfa parameter:", mfaParam)

    // Check sessionStorage for MFA requirement
    const mfaEmailStored = sessionStorage.getItem("mfaEmail")
    const mfaRequiredStored = sessionStorage.getItem("mfaRequired")
    console.log("🔍 SessionStorage mfaEmail:", mfaEmailStored)
    console.log("🔍 SessionStorage mfaRequired:", mfaRequiredStored)

    // Check for error messages and credentials from header login
    const loginError = sessionStorage.getItem("loginError")
    const loginEmail = sessionStorage.getItem("loginEmail")
    const loginPassword = sessionStorage.getItem("loginPassword")

    console.log("🔍 SessionStorage loginError:", loginError)
    console.log("🔍 SessionStorage loginEmail:", loginEmail)
    console.log("🔍 SessionStorage loginPassword:", !!loginPassword)

    // Handle MFA requirement
    if (mfaParam === "required" || mfaRequiredStored === "true") {
      console.log("🔐 MFA REQUIRED detected!")
      setMfaRequired(true)

      if (mfaEmailStored) {
        console.log("📧 Setting prefill email from MFA:", mfaEmailStored)
        setPrefillEmail(mfaEmailStored)
      }
    }

    // Handle error messages
    if (loginError) {
      console.log("❌ Setting error message:", loginError)
      setErrorMessage(loginError)
      sessionStorage.removeItem("loginError")
    }

    // Handle email prefill
    if (loginEmail) {
      console.log("📧 Setting prefill email from login:", loginEmail)
      setPrefillEmail(loginEmail)
      sessionStorage.removeItem("loginEmail")
    }

    // Handle password prefill (if exists - but we're removing this for security)
    if (loginPassword) {
      console.log("🔒 Found stored password - removing for security")
      sessionStorage.removeItem("loginPassword")
    }

    checkSession()
  }, [searchParams])

  if (isLoading) {
    console.log("⏳ Page loading...")
    return <div className="container mx-auto py-10 text-gray-900 dark:text-white">Loading...</div>
  }

  if (isLoggedIn) {
    console.log("✅ User already logged in - showing logged in message")
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

  console.log("🎯 Rendering sign-in form with:")
  console.log("📧 Prefill email:", prefillEmail)
  console.log("🔐 MFA required:", mfaRequired)
  console.log("❌ Error message:", errorMessage)

  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {mfaRequired ? "Two-Factor Authentication Required" : "Welcome back!"}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {mfaRequired ? (
            <>
              Please enter your verification code to continue.{" "}
              <Link
                href="/auth/sign-up"
                className="font-medium text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Don't have an account? Sign up
              </Link>
            </>
          ) : (
            <>
              Don't have an account yet?{" "}
              <Link
                href="/auth/sign-up"
                className="font-medium text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>

      {errorMessage && (
        <Alert className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
          <AlertDescription className="text-red-800 dark:text-red-300">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <SignInForm prefillEmail={prefillEmail} prefillPassword={prefillPassword} mfaRequired={mfaRequired} />
    </>
  )
}
