"use client"

import type React from "react"

import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"

export default function AuthTest() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    }
  }

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto my-8">
      <h2 className="text-xl font-bold mb-4">NextAuth Test</h2>

      <div className="mb-4">
        <p>
          Status: <span className="font-semibold">{status}</span>
        </p>
        {session && (
          <div className="mt-2">
            <p>Signed in as: {session.user?.email}</p>
          </div>
        )}
      </div>

      {!session ? (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Sign In
          </button>
        </form>
      ) : (
        <button onClick={() => signOut()} className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">
          Sign Out
        </button>
      )}
    </div>
  )
}
