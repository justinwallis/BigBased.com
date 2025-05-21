"use client"

import { useState } from "react"

const SignUpForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  })
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setEmailError("")
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordError("")

    setPasswordRequirements({
      minLength: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    })
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    setConfirmPasswordError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Email validation
    if (!email) {
      setEmailError("Email is required")
      return
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid")
      return
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required")
      return
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      return
    }

    if (
      !passwordRequirements.minLength ||
      !passwordRequirements.uppercase ||
      !passwordRequirements.lowercase ||
      !passwordRequirements.number ||
      !passwordRequirements.specialChar
    ) {
      setPasswordError("Password does not meet all requirements")
      return
    }

    // Handle form submission logic here
    console.log("Form submitted", { email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          value={email}
          onChange={handleEmailChange}
        />
        {emailError && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{emailError}</p>}
      </div>
      <div className="mt-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          value={password}
          onChange={handlePasswordChange}
        />
        {passwordError && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{passwordError}</p>}
        <div className="mt-2">
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password must contain:</p>
          <ul>
            <li>
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                <svg
                  className={passwordRequirements.minLength ? "text-green-500" : "text-red-500"}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  {passwordRequirements.minLength ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
                At least 8 characters
              </span>
            </li>
            <li>
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                <svg
                  className={passwordRequirements.uppercase ? "text-green-500" : "text-red-500"}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  {passwordRequirements.uppercase ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
                One uppercase letter
              </span>
            </li>
            <li>
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                <svg
                  className={passwordRequirements.lowercase ? "text-green-500" : "text-red-500"}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  {passwordRequirements.lowercase ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
                One lowercase letter
              </span>
            </li>
            <li>
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                <svg
                  className={passwordRequirements.number ? "text-green-500" : "text-red-500"}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  {passwordRequirements.number ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
                One number
              </span>
            </li>
            <li>
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                <svg
                  className={passwordRequirements.specialChar ? "text-green-500" : "text-red-500"}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  {passwordRequirements.specialChar ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
                One special character
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        {confirmPasswordError && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{confirmPasswordError}</p>}
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          Sign Up
        </button>
      </div>
    </form>
  )
}

export default SignUpForm
