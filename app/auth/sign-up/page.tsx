"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabaseClient } from "@/lib/supabase/client"
import SignUpForm from "@/components/auth/sign-up-form"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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

    checkSession()
  }, [])

  if (isLoading) {
    return <div className="container mx-auto py-10">Loading...</div>
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
      </div>
      <SignUpForm />
    </>
  )
}
