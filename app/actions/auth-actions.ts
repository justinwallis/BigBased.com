"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { logAuthEvent } from "./auth-log-actions"
import { AUTH_EVENTS, AUTH_STATUS } from "@/app/constants/auth-log-constants"
import { generateRandomString } from "@/lib/utils"

// Validate password strength
function validatePassword(password: string): { valid: boolean; message?: string } {
  // Check minimum length
  if (password.length < 10) {
    return { valid: false, message: "Password must be at least 10 characters long" }
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" }
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" }
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" }
  }

  // Check for special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character" }
  }

  return { valid: true }
}

// Register a new user
export async function register(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!email || !password || !confirmPassword) {
    return { error: "Email and password are required" }
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  // Validate password strength
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    return { error: passwordValidation.message }
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (!supabaseUrl || !supabaseAnonKey) {
      return { error: "Missing Supabase configuration" }
    }

    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Log signup attempt
    try {
      await logAuthEvent(null, AUTH_EVENTS.SIGNUP_ATTEMPT, AUTH_STATUS.PENDING, { email })
    } catch (logError) {
      console.error("Error logging signup attempt:", logError)
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

    if (error) {
      // Log signup failure
      try {
        await logAuthEvent(null, AUTH_EVENTS.SIGNUP_ATTEMPT, AUTH_STATUS.FAILURE, {
          email,
          error: error.message,
        })
      } catch (logError) {
        console.error("Error logging signup failure:", logError)
      }
      return { error: error.message }
    }

    // Log signup success
    try {
      await logAuthEvent(null, AUTH_EVENTS.SIGNUP_ATTEMPT, AUTH_STATUS.SUCCESS, { email })
    } catch (logError) {
      console.error("Error logging signup success:", logError)
    }

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "An unexpected error occurred during registration" }
  }
}

// Sign in a user
export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const supabase = createServerClient()

    // Log login attempt
    try {
      await logAuthEvent(null, AUTH_EVENTS.LOGIN_ATTEMPT, AUTH_STATUS.PENDING, { email })
    } catch (logError) {
      console.error("Error logging auth event:", logError)
      // Continue with login even if logging fails
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Log login failure
      try {
        await logAuthEvent(null, AUTH_EVENTS.LOGIN_ATTEMPT, AUTH_STATUS.FAILURE, {
          email,
          error: error.message,
        })
      } catch (logError) {
        console.error("Error logging auth failure:", logError)
      }
      return { error: error.message }
    }

    // Log login success
    try {
      if (data.user) {
        await logAuthEvent(data.user.id, AUTH_EVENTS.LOGIN_SUCCESS, AUTH_STATUS.SUCCESS, { email })
      }
    } catch (logError) {
      console.error("Error logging auth success:", logError)
    }

    return { success: true }
  } catch (error) {
    console.error("Sign in error:", error)
    return { error: "An unexpected error occurred during sign in" }
  }
}

// Sign out a user
export async function signOut() {
  try {
    const supabase = createServerClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Log logout attempt
    if (session?.user) {
      await logAuthEvent(session.user.id, AUTH_EVENTS.LOGOUT, AUTH_STATUS.PENDING, {})
    }

    // Sign out
    await supabase.auth.signOut()

    // Log logout success
    if (session?.user) {
      await logAuthEvent(session.user.id, AUTH_EVENTS.LOGOUT, AUTH_STATUS.SUCCESS, {})
    }
  } catch (error) {
    console.error("Sign out error:", error)
  }

  redirect("/auth/sign-in")
}

// Reset password request
export async function resetPasswordRequest(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required" }
  }

  try {
    const supabase = createServerClient()

    // Log password reset request
    await logAuthEvent(null, AUTH_EVENTS.PASSWORD_RESET_REQUEST, AUTH_STATUS.PENDING, { email })

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
    })

    if (error) {
      // Log password reset request failure
      await logAuthEvent(null, AUTH_EVENTS.PASSWORD_RESET_REQUEST, AUTH_STATUS.FAILURE, {
        email,
        error: error.message,
      })
      return { error: error.message }
    }

    // Log password reset request success
    await logAuthEvent(null, AUTH_EVENTS.PASSWORD_RESET_REQUEST, AUTH_STATUS.SUCCESS, { email })

    return { success: true }
  } catch (error) {
    console.error("Password reset request error:", error)
    return { error: "An unexpected error occurred during password reset request" }
  }
}

// Reset password
export async function resetPassword(formData: FormData) {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    return { error: "Password is required" }
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  // Validate password strength
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    return { error: passwordValidation.message }
  }

  try {
    const supabase = createServerClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { error: "No user found. Please try the reset password link again." }
    }

    // Log password reset attempt
    await logAuthEvent(session.user.id, AUTH_EVENTS.PASSWORD_RESET_SUCCESS, AUTH_STATUS.PENDING, {})

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      // Log password reset failure
      await logAuthEvent(session.user.id, AUTH_EVENTS.PASSWORD_RESET_SUCCESS, AUTH_STATUS.FAILURE, {
        error: error.message,
      })
      return { error: error.message }
    }

    // Log password reset success
    await logAuthEvent(session.user.id, AUTH_EVENTS.PASSWORD_RESET_SUCCESS, AUTH_STATUS.SUCCESS, {})

    return { success: true }
  } catch (error) {
    console.error("Password reset error:", error)
    return { error: "An unexpected error occurred during password reset" }
  }
}

// Generate backup codes
export async function generateBackupCodes() {
  try {
    const supabase = createServerClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { error: "Not authenticated" }
    }

    // Generate 10 backup codes
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      // Generate a random 8-character code
      const code = generateRandomString(8).toUpperCase()
      codes.push(code)
    }

    // Store the backup codes in the database
    const { error } = await supabase.from("backup_codes").insert(
      codes.map((code) => ({
        user_id: session.user.id,
        code: code,
        is_used: false,
      })),
    )

    if (error) {
      console.error("Error storing backup codes:", error)
      return { success: false, error: error.message }
    }

    // Log backup code generation
    await logAuthEvent(session.user.id, AUTH_EVENTS.BACKUP_CODE_GENERATION, AUTH_STATUS.SUCCESS, {
      count: codes.length,
    })

    return { success: true, data: { codes } }
  } catch (error) {
    console.error("Error generating backup codes:", error)
    return { success: false, error: "Failed to generate backup codes" }
  }
}

// Verify backup code
export async function verifyBackupCode(code: string) {
  try {
    const supabase = createServerClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { success: false, error: "Not authenticated" }
    }

    // Find the backup code
    const { data, error } = await supabase
      .from("backup_codes")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("code", code)
      .eq("is_used", false)
      .single()

    if (error || !data) {
      // Log backup code verification failure
      await logAuthEvent(session.user.id, AUTH_EVENTS.BACKUP_CODE_USAGE, AUTH_STATUS.FAILURE, {
        code: code,
        error: error?.message || "Invalid or used backup code",
      })
      return { success: false, error: "Invalid or used backup code" }
    }

    // Mark the backup code as used
    const { error: updateError } = await supabase
      .from("backup_codes")
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq("id", data.id)

    if (updateError) {
      console.error("Error marking backup code as used:", updateError)
      return { success: false, error: updateError.message }
    }

    // Log backup code usage
    await logAuthEvent(session.user.id, AUTH_EVENTS.BACKUP_CODE_USAGE, AUTH_STATUS.SUCCESS, {
      code_id: data.id,
    })

    return { success: true }
  } catch (error) {
    console.error("Error verifying backup code:", error)
    return { success: false, error: "Failed to verify backup code" }
  }
}
