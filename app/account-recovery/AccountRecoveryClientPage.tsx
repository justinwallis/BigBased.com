"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

export function AccountRecoveryClientPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    try {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Recovery instructions sent to your email")
    } catch (err) {
      console.error("Error initiating account recovery:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10 flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="flex justify-start mb-6">
          <Link href="/" className="text-blue-600 hover:underline flex items-center">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Account Recovery</h2>
            <p className="text-gray-600">
              Enter your email address and we'll send you instructions to recover your account.
            </p>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {success ? (
            <div className="space-y-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>

              <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-md p-4">
                <div className="flex items-start">
                  <div>
                    <h3 className="font-medium">Check your email</h3>
                    <p className="text-sm mt-1">
                      We've sent recovery instructions to <strong>{email}</strong>. Please check your inbox and spam
                      folder.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your account email"
                  required
                  disabled={isSubmitting}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Recover Account"}
              </button>
            </form>
          )}

          <div className="mt-4 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountRecoveryClientPage
