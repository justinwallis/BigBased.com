"use server"

import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { generateRandomString } from "@/lib/utils"
import { validatePassword } from "@/lib/password-validation"
import { createProfile } from "./profile-actions" // Add this import

// Auth event constants (duplicated here to avoid import issues)
const AUTH_EVENTS = {
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILURE: "login_failure",
  LOGOUT: "logout",
  SIGNUP_ATTEMPT: "signup_attempt",
  PASSWORD_RESET_REQUEST: "password_reset_request",
  PASSWORD_RESET_SUCCESS: "password_reset_success",
  BACKUP_CODE_GENERATION: "backup_code_generation",
  BACKUP_CODE_USAGE: "backup_code_usage",
  TRUSTED_DEVICE_ADDED: "trusted_device_added",
  TRUSTED_DEVICE_REMOVED: "trusted_device_removed",
  ACCOUNT_RECOVERY_REQUEST: "account_recovery_request",
  ACCOUNT_RECOVERY_SUCCESS: "account_recovery_success",
} as const

const AUTH_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILURE: "failure",
} as const

// Simple logging function to avoid import issues
async function logAuthEvent(userId: string | null, event: string, status: string, metadata: any) {
  try {
    // Simple console log for now - can be enhanced later
    console.log("Auth Event:", { userId, event, status, metadata, timestamp: new Date().toISOString() })
  } catch (error) {
    console.error("Error logging auth event:", error)
    return { success: false, error: error.message }
  }
}

// Create a Supabase client for server actions
async function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}

export async function signIn(email: string, password: string, mfaCode?: string) {
  try {
    const supabase = await getSupabase()

    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    // Log login attempt
    await logAuthEvent(null, AUTH_EVENTS.LOGIN_ATTEMPT, AUTH_STATUS.PENDING, { email })

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Log login failure
      await logAuthEvent(null, AUTH_EVENTS.LOGIN_ATTEMPT, AUTH_STATUS.FAILURE, {
        email,
        error: error.message,
      })
      return { error: error.message }
    }

    // If MFA is required, return mfaRequired flag
    if (data?.session?.factor_challenge) {
      return { data: null, error: null, mfaRequired: true }
    }

    // Set cookies for client-side auth
    const cookieStore = cookies()
    const session = data.session

    if (session) {
      cookieStore.set("sb-access-token", session.access_token, {
        path: "/",
        maxAge: session.expires_in,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })

      cookieStore.set("sb-refresh-token", session.refresh_token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
    }

    // Log login success
    if (data.user) {
      await logAuthEvent(data.user.id, AUTH_EVENTS.LOGIN_SUCCESS, AUTH_STATUS.SUCCESS, { email })
    }

    return { data, error: null }
  } catch (error) {
    console.error("Sign in error:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function signOut() {
  try {
    const supabase = await getSupabase()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Log logout attempt
    if (session?.user) {
      await logAuthEvent(session.user.id, AUTH_EVENTS.LOGOUT, AUTH_STATUS.PENDING, {})
    }

    await supabase.auth.signOut()

    // Clear cookies
    const cookieStore = cookies()
    cookieStore.delete("sb-access-token")
    cookieStore.delete("sb-refresh-token")

    // Log logout success
    if (session?.user) {
      await logAuthEvent(session.user.id, AUTH_EVENTS.LOGOUT, AUTH_STATUS.SUCCESS, {})
    }

    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function register(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!email || !password || !confirmPassword) {
      return { error: "All fields are required" }
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" }
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return { error: passwordValidation.message }
    }

    const supabase = await getSupabase()

    // Log signup attempt
    await logAuthEvent(null, AUTH_EVENTS.SIGNUP_ATTEMPT, AUTH_STATUS.PENDING, { email })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"}/auth/callback`,
      },
    })

    if (error) {
      // Log signup failure
      await logAuthEvent(null, AUTH_EVENTS.SIGNUP_ATTEMPT, AUTH_STATUS.FAILURE, {
        email,
        error: error.message,
      })
      return { error: error.message }
    }

    // Create a profile for the new user
    if (data.user) {
      console.log("Creating profile for new user:", data.user.id)
      await createProfile({
        id: data.user.id,
        email: data.user.email || email,
        username: email.split("@")[0],
      })
    }

    // Log signup success
    await logAuthEvent(null, AUTH_EVENTS.SIGNUP_ATTEMPT, AUTH_STATUS.SUCCESS, { email })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function resetPasswordRequest(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required" }
  }

  try {
    const supabase = await getSupabase()

    // Log password reset request
    await logAuthEvent(null, AUTH_EVENTS.PASSWORD_RESET_REQUEST, AUTH_STATUS.PENDING, { email })

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"}/auth/reset-password`,
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
    const supabase = await getSupabase()

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

export async function generateBackupCodes() {
  try {
    const supabase = await getSupabase()

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

export async function verifyBackupCode(code: string) {
  try {
    const supabase = await getSupabase()

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
