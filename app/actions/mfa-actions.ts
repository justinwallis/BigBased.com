"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { generateSecret, verifyToken } from "node-2fa"
import { randomBytes, createHash } from "crypto"
import { logAuthEvent } from "./auth-log-actions"
import { AUTH_EVENTS, AUTH_STATUS } from "@/app/constants/auth-constants"

// Helper to get authenticated user
async function getAuthenticatedUser() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("Not authenticated")
  }

  return { userId: session.user.id, supabase }
}

// Get MFA status for the current user
export async function getMfaStatus() {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from("mfa_settings")
      .select("mfa_enabled, mfa_type")
      .eq("id", userId)
      .single()

    if (error) throw error

    return {
      success: true,
      data: {
        enabled: data.mfa_enabled,
        type: data.mfa_type,
      },
    }
  } catch (error) {
    console.error("Error getting MFA status:", error)
    return {
      success: false,
      error: "Failed to get MFA status",
    }
  }
}

// Generate a new authenticator secret
export async function generateAuthenticatorSecret(email: string) {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    // Log the MFA setup attempt
    await logAuthEvent(userId, AUTH_EVENTS.MFA_SETUP_ATTEMPT, AUTH_STATUS.PENDING, {
      method: "authenticator",
      email,
    })

    // Generate a new secret
    const { secret, qr } = generateSecret({
      name: "Big Based",
      account: email,
    })

    // Store the secret in the database
    const { error } = await supabase
      .from("mfa_settings")
      .update({
        authenticator_secret: secret,
      })
      .eq("id", userId)

    if (error) throw error

    return {
      success: true,
      data: {
        secret,
        qrCode: qr,
      },
    }
  } catch (error) {
    console.error("Error generating authenticator secret:", error)

    // Log the failure
    try {
      const { userId } = await getAuthenticatedUser()
      await logAuthEvent(userId, AUTH_EVENTS.MFA_SETUP_FAILURE, AUTH_STATUS.FAILURE, {
        method: "authenticator",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } catch {
      // Ignore logging errors
    }

    return {
      success: false,
      error: "Failed to generate authenticator secret",
    }
  }
}

// Verify authenticator token and enable MFA
export async function verifyAndEnableMfa(token: string) {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    // Log the verification attempt
    await logAuthEvent(userId, AUTH_EVENTS.MFA_VERIFICATION_ATTEMPT, AUTH_STATUS.PENDING, {
      method: "authenticator",
    })

    // Get the secret from the database
    const { data: mfaData, error: mfaError } = await supabase
      .from("mfa_settings")
      .select("authenticator_secret")
      .eq("id", userId)
      .single()

    if (mfaError || !mfaData.authenticator_secret) {
      throw new Error("MFA not set up")
    }

    // Verify the token
    const verified = verifyToken(mfaData.authenticator_secret, token)
    if (!verified || verified.delta !== 0) {
      // Log the failure
      await logAuthEvent(userId, AUTH_EVENTS.MFA_VERIFICATION_FAILURE, AUTH_STATUS.FAILURE, {
        method: "authenticator",
        reason: "Invalid token",
      })

      return {
        success: false,
        error: "Invalid verification code",
      }
    }

    // Enable MFA
    const { error } = await supabase
      .from("mfa_settings")
      .update({
        mfa_enabled: true,
        mfa_type: "authenticator",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) throw error

    // Log the success
    await logAuthEvent(userId, AUTH_EVENTS.MFA_SETUP_SUCCESS, AUTH_STATUS.SUCCESS, {
      method: "authenticator",
    })

    return { success: true }
  } catch (error) {
    console.error("Error verifying and enabling MFA:", error)

    // Log the failure
    try {
      const { userId } = await getAuthenticatedUser()
      await logAuthEvent(userId, AUTH_EVENTS.MFA_SETUP_FAILURE, AUTH_STATUS.FAILURE, {
        method: "authenticator",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } catch {
      // Ignore logging errors
    }

    return {
      success: false,
      error: "Failed to verify and enable MFA",
    }
  }
}

// Generate backup codes
export async function generateBackupCodes() {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    // Delete existing backup codes
    await supabase.from("backup_codes").delete().eq("user_id", userId)

    // Generate 10 new backup codes
    const codes = Array(10)
      .fill(0)
      .map(() => {
        const bytes = randomBytes(9) // 9 bytes = 18 hex chars
        const hex = bytes.toString("hex")
        // Format as XXXX-XXXX-XXXX
        return `${hex.substring(0, 4)}-${hex.substring(4, 8)}-${hex.substring(8, 12)}`.toUpperCase()
      })

    // Hash the codes for storage
    const hashedCodes = codes.map((code) => {
      return {
        user_id: userId,
        code: createHash("sha256").update(code).digest("hex"),
        is_used: false,
      }
    })

    // Store the hashed codes
    const { error } = await supabase.from("backup_codes").insert(hashedCodes)

    if (error) throw error

    // Log the generation
    await logAuthEvent(userId, AUTH_EVENTS.BACKUP_CODE_GENERATION, AUTH_STATUS.SUCCESS, {
      count: codes.length,
    })

    return {
      success: true,
      data: { codes },
    }
  } catch (error) {
    console.error("Error generating backup codes:", error)
    return {
      success: false,
      error: "Failed to generate backup codes",
    }
  }
}

// Verify backup code
export async function verifyBackupCode(code: string) {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    // Log the attempt
    await logAuthEvent(userId, AUTH_EVENTS.MFA_VERIFICATION_ATTEMPT, AUTH_STATUS.PENDING, {
      method: "backup_code",
    })

    // Hash the provided code
    const hashedCode = createHash("sha256").update(code).digest("hex")

    // Check if the code exists and is not used
    const { data, error } = await supabase
      .from("backup_codes")
      .select("id")
      .eq("user_id", userId)
      .eq("code", hashedCode)
      .eq("is_used", false)
      .single()

    if (error || !data) {
      // Log the failure
      await logAuthEvent(userId, AUTH_EVENTS.MFA_VERIFICATION_FAILURE, AUTH_STATUS.FAILURE, {
        method: "backup_code",
        reason: "Invalid or already used code",
      })

      return {
        success: false,
        error: "Invalid or already used backup code",
      }
    }

    // Mark the code as used
    await supabase
      .from("backup_codes")
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
      })
      .eq("id", data.id)

    // Log the success
    await logAuthEvent(userId, AUTH_EVENTS.BACKUP_CODE_USAGE, AUTH_STATUS.SUCCESS, {
      method: "backup_code",
    })

    return { success: true }
  } catch (error) {
    console.error("Error verifying backup code:", error)
    return {
      success: false,
      error: "Failed to verify backup code",
    }
  }
}
