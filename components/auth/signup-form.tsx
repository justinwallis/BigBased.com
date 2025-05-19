"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { register } from "@/app/actions/auth-actions"
import { logAuthEvent } from "@/app/actions/auth-log-actions"
import { AUTH_EVENTS, AUTH_STATUS } from "@/app/constants/auth-log-constants"

interface State {
  message: string | null
}

const initialState: State = {
  message: null,
}

export default function SignupForm() {
  const [state, setState] = useState(initialState)
  const router = useRouter()

  return (
    <form
      aria-labelledby="signup-title"
      action={async (formData) => {
        const result = await register(formData)
        if (result?.error) {
          setState({ message: result.error })
          logAuthEvent(AUTH_EVENTS.SIGNUP_FAILED, AUTH_STATUS.FAILURE, result.error)
        } else {
          setState({ message: null })
          router.push("/login")
          logAuthEvent(AUTH_EVENTS.SIGNUP_SUCCESS, AUTH_STATUS.SUCCESS, "User signed up successfully")
        }
      }}
    >
      <h1 id="signup-title" className="text-2xl font-bold">
        Sign Up
      </h1>
      {state?.message ? <p className="mt-2 text-red-500">{state?.message}</p> : null}
      <div className="mt-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
    >
      {pending ? "Creating account..." : "Create account"}
    </button>
  )
}
