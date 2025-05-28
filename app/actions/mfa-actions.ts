"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { generateSecret, verifyToken } from "node-2fa"
import { randomBytes, createHash } from "crypto"
import QRCode from "qrcode"

// Helper to get authenticated user
async function getAuthenticatedUser(useServiceRole = false) {
  const supabase = createServerSupabaseClient(useServiceRole)

  // Use getUser() instead of getSession() for better security
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error("Not authenticated")
  }

  return { userId: user.id, supabase, user }
}

// Get MFA status for the current user
export async function getMfaStatus() {
  try {
    // Use regular client for reading
    const { userId, supabase } = await getAuthenticatedUser(false)

    const { data, error } = await supabase
      .from("mfa_settings")
      .select("mfa_enabled, mfa_type")
      .eq("id", userId)
      .single()

    if (error) {
      console.log("MFA settings not found, will create with service role")

      // Use service role for writing
      const { userId: serviceUserId, supabase: serviceSupabase } = await getAuthenticatedUser(true)

      // Create MFA settings if they don't exist
      const { error: insertError } = await serviceSupabase.from("mfa_settings").insert({
        id: serviceUserId,
        mfa_enabled: false,
        mfa_type: null,
      })

      if (insertError) {
        console.error("Failed to create MFA settings:", insertError)
        throw insertError
      }

      return {
        success: true,
        data: {
          enabled: false,
          type: null,
        },
      }
    }

    return {
      success: true,
      data: {
        enabled: data?.mfa_enabled || false,
        type: data?.mfa_type || null,
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
    // Get user with regular client
    const { userId, user } = await getAuthenticatedUser(false)

    // But use service role for database operations
    const serviceSupabase = createServerSupabaseClient(true)

    console.log("Generating secret for user:", userId, "email:", email)

    // Generate a new secret
    const secretData = generateSecret({
      name: "Big Based",
      account: email,
      length: 32,
    })

    console.log("Generated secret data:", {
      hasSecret: !!secretData.secret,
      hasUri: !!secretData.uri,
    })

    if (!secretData.secret || !secretData.uri) {
      throw new Error("Failed to generate secret or URI")
    }

    // Generate QR code as data URL using qrcode library
    const qrCodeDataUrl = await QRCode.toDataURL(secretData.uri, {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 256,
    })

    console.log("Generated QR code:", {
      isDataUrl: qrCodeDataUrl.startsWith("data:"),
      length: qrCodeDataUrl.length,
    })

    // First, ensure MFA settings record exists
    const { data: existingSettings } = await serviceSupabase.from("mfa_settings").select("id").eq("id", userId).single()

    if (!existingSettings) {
      console.log("Creating MFA settings record for user:", userId)
      const { error: insertError } = await serviceSupabase.from("mfa_settings").insert({
        id: userId,
        mfa_enabled: false,
        mfa_type: null,
        authenticator_secret: secretData.secret,
      })

      if (insertError) {
        console.error("Failed to create MFA settings:", insertError)
        throw insertError
      }
    } else {
      // Update existing record
      const { error: updateError } = await serviceSupabase
        .from("mfa_settings")
        .update({
          authenticator_secret: secretData.secret,
        })
        .eq("id", userId)

      if (updateError) {
        console.error("Failed to update MFA settings:", updateError)
        throw updateError
      }
    }

    console.log("Secret stored successfully for user:", userId)

    return {
      success: true,
      data: {
        secret: secretData.secret,
        qrCode: qrCodeDataUrl,
      },
    }
  } catch (error) {
    console.error("Error generating authenticator secret:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate authenticator secret",
    }
  }
}

// Verify authenticator token and enable MFA
export async function verifyAndEnableMfa(token: string) {
  try {
    // Get user with regular client
    const { userId } = await getAuthenticatedUser(false)

    // But use service role for database operations
    const serviceSupabase = createServerSupabaseClient(true)

    console.log("Verifying MFA for user:", userId, "with token:", token)

    // Get the secret from the database
    const { data: mfaData, error: mfaError } = await serviceSupabase
      .from("mfa_settings")
      .select("authenticator_secret")
      .eq("id", userId)
      .single()

    console.log("MFA data retrieved:", {
      hasData: !!mfaData,
      hasSecret: !!mfaData?.authenticator_secret,
      error: mfaError,
    })

    if (mfaError || !mfaData?.authenticator_secret) {
      console.error("MFA not set up - no secret found for user:", userId)
      throw new Error("MFA not set up - please generate a new QR code")
    }

    // Verify the token
    const verified = verifyToken(mfaData.authenticator_secret, token)
    console.log("Token verification result:", verified)

    if (!verified || verified.delta !== 0) {
      return {
        success: false,
        error: "Invalid verification code",
      }
    }

    // Enable MFA
    const { error } = await serviceSupabase
      .from("mfa_settings")
      .update({
        mfa_enabled: true,
        mfa_type: "authenticator",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Failed to enable MFA:", error)
      throw error
    }

    console.log("MFA enabled successfully for user:", userId)
    return { success: true }
  } catch (error) {
    console.error("Error verifying and enabling MFA:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify and enable MFA",
    }
  }
}

// Generate backup codes
export async function generateBackupCodes() {
  try {
    // Get user with regular client
    const { userId } = await getAuthenticatedUser(false)

    // But use service role for database operations
    const serviceSupabase = createServerSupabaseClient(true)

    // Delete existing backup codes
    await serviceSupabase.from("backup_codes").delete().eq("user_id", userId)

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
    const { error } = await serviceSupabase.from("backup_codes").insert(hashedCodes)

    if (error) throw error

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
    // Get user with regular client
    const { userId } = await getAuthenticatedUser(false)

    // But use service role for database operations
    const serviceSupabase = createServerSupabaseClient(true)

    // Hash the provided code
    const hashedCode = createHash("sha256").update(code).digest("hex")

    // Check if the code exists and is not used
    const { data, error } = await serviceSupabase
      .from("backup_codes")
      .select("id")
      .eq("user_id", userId)
      .eq("code", hashedCode)
      .eq("is_used", false)
      .single()

    if (error || !data) {
      return {
        success: false,
        error: "Invalid or already used backup code",
      }
    }

    // Mark the code as used
    await serviceSupabase
      .from("backup_codes")
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
      })
      .eq("id", data.id)

    return { success: true }
  } catch (error) {
    console.error("Error verifying backup code:", error)
    return {
      success: false,
      error: "Failed to verify backup code",
    }
  }
}

// Disable MFA
export async function disableMfa() {
  try {
    // Get user with regular client
    const { userId } = await getAuthenticatedUser(false)

    // But use service role for database operations
    const serviceSupabase = createServerSupabaseClient(true)

    // Disable MFA
    const { error } = await serviceSupabase
      .from("mfa_settings")
      .update({
        mfa_enabled: false,
        mfa_type: null,
        authenticator_secret: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) throw error

    // Delete all backup codes
    await serviceSupabase.from("backup_codes").delete().eq("user_id", userId)

    return { success: true }
  } catch (error) {
    console.error("Error disabling MFA:", error)
    return {
      success: false,
      error: "Failed to disable MFA",
    }
  }
}
