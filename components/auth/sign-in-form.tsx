"use client"

import { useState } from "react"

export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Handle sign-in logic here
    console.log("Signing in with:", email, password)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">Sign In</h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-blue-400 bg-gray-50"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-blue-400 bg-gray-50"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
