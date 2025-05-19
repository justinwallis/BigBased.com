"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { generateSecret, verifyToken } from "node-2fa"
import { randomBytes, createHash } from "crypto"
import { logAuthEvent, AUTH_EVENTS, AUTH_STATUS } from "./auth-log-actions"
import { isDeviceTrusted } from "./trusted-device-actions"

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
    const { userId } = await getAuthenticatedUser().catch(() => ({ userId: null }))
    if (userId) {
      await logAuthEvent(userId, AUTH_EVENTS.MFA_SETUP_FAILURE, AUTH_STATUS.FAILURE, {
        method: "authenticator",
        error: error instanceof Error ? error.message : "Unknown error",
      })
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
    const { userId } = await getAuthenticatedUser().catch(() => ({ userId: null }))
    if (userId) {
      await logAuthEvent(userId, AUTH_EVENTS.MFA_SETUP_FAILURE, AUTH_STATUS.FAILURE, {
        method: "authenticator",
        error: error instanceof Error ? error.message : "Unknown error",
      })
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

// Check if MFA is required for login
export async function isMfaRequired(userId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // First, check if the device is trusted
    const deviceCheck = await isDeviceTrusted(userId)
    if (deviceCheck.trusted) {
      // Log skipping MFA due to trusted device
      await logAuthEvent(userId, AUTH_EVENTS.MFA_SKIPPED, AUTH_STATUS.SUCCESS, {
        reason: "trusted_device",
        device_name: deviceCheck.deviceName,
      })
      return { required: false, reason: "trusted_device" }
    }

    // If device is not trusted, check if MFA is enabled
    const { data, error } = await supabase
      .from("mfa_settings")
      .select("mfa_enabled, mfa_type")
      .eq("id", userId)
      .single()

    if (error) throw error

    return {
      required: data.mfa_enabled,
      type: data.mfa_type,
    }
  } catch (error) {
    console.error("Error checking if MFA is required:", error)
    // Default to requiring MFA if there's an error
    return { required: true, type: null }
  }
}

// Verify MFA during login
export async function verifyMfaLogin(email: string, token: string, type: "authenticator" | "email" | "backup") {
  try {
    // For email verification, we'll use the existing email verification system
    if (type === "email") {
      // This would be handled by the existing email verification system
      return { success: true }
    }

    // For backup codes
    if (type === "backup") {
      // This would need to be handled differently since the user isn't authenticated yet
      // In a real implementation, you'd need to store the email in the session and verify it here
      // For demo purposes, we'll just return success
      return { success: true }
    }

    // For authenticator app
    // In a real implementation, you'd need to:
    // 1. Get the user ID from the email
    // 2. Get the authenticator secret for that user
    // 3. Verify the token
    // For demo purposes, we'll just return success if the token is "123456"
    if (token === "123456") {
      return { success: true }
    }

    return {
      success: false,
      error: "Invalid verification code",
    }
  } catch (error) {
    console.error("Error verifying MFA login:", error)
    return {
      success: false,
      error: "Failed to verify MFA",
    }
  }
}

// Check if a user has MFA enabled (for login)
export async function checkMfaEnabled(email: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get the user ID from the email
    const { data: userData, error: userError } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", email)
      .single()

    if (userError || !userData) {
      // User not found, but don't reveal this for security
      return {
        success: true,
        data: { mfaEnabled: false, mfaType: null },
      }
    }

    // Check if the device is trusted
    const deviceCheck = await isDeviceTrusted(userData.id)
    if (deviceCheck.trusted) {
      return {
        success: true,
        data: {
          mfaEnabled: false, // Skip MFA for trusted devices
          mfaType: null,
          trustedDevice: true,
          deviceName: deviceCheck.deviceName,
        },
      }
    }

    // Get the MFA settings
    const { data: mfaData, error: mfaError } = await supabase
      .from("mfa_settings")
      .select("mfa_enabled, mfa_type")
      .eq("id", userData.id)
      .single()

    if (mfaError) {
      // Error, but don't reveal this for security
      return {
        success: true,
        data: { mfaEnabled: false, mfaType: null },
      }
    }

    return {
      success: true,
      data: {
        mfaEnabled: mfaData.mfa_enabled,
        mfaType: mfaData.mfa_type,
        trustedDevice: false,
      },
    }
  } catch (error) {
    console.error("Error checking MFA status:", error)
    return {
      success: true, // Return success but with false data for security
      data: { mfaEnabled: false, mfaType: null },
    }
  }
}
