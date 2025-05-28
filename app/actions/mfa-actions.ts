"use server"

import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { generateSecret, verifyToken } from "node-2fa"
import { randomBytes, createHash } from "crypto"
import QRCode from "qrcode"
import type { Database } from "@/types/supabase"

// Helper to get authenticated user with regular client
async function getAuthenticatedUser() {
  try {
    const cookieStore = cookies()
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error("Error setting cookie:", error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 })
          } catch (error) {
            console.error("Error removing cookie:", error)
          }
        },
      },
    })

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      throw new Error(`Not authenticated: ${error?.message || "No user found"}`)
    }

    return { userId: user.id, user }
  } catch (error) {
    console.error("Error in getAuthenticatedUser:", error)
    throw error
  }
}

// Helper to create service role client using direct Supabase client
function createServiceRoleClient() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase service role environment variables")
    }

    // Use the direct Supabase client instead of SSR wrapper
    const client = createClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    return client
  } catch (error) {
    console.error("Error creating service role client:", error)
    throw error
  }
}

// Get MFA status for the current user
export async function getMfaStatus() {
  try {
    const { userId } = await getAuthenticatedUser()
    const serviceSupabase = createServiceRoleClient()

    const { data, error } = await serviceSupabase
      .from("mfa_settings")
      .select("mfa_enabled, mfa_type")
      .eq("id", userId)
      .maybeSingle()

    if (error) {
      console.log("MFA settings not found, will create new record")

      // Create MFA settings if they don't exist
      const { error: insertError } = await serviceSupabase.from("mfa_settings").insert({
        id: userId,
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
      error: error instanceof Error ? error.message : "Failed to get MFA status",
    }
  }
}

// Generate a new authenticator secret
export async function generateAuthenticatorSecret(email: string) {
  try {
    console.log("=== generateAuthenticatorSecret called ===")
    const { userId } = await getAuthenticatedUser()
    const serviceSupabase = createServiceRoleClient()

    // Generate a new secret
    const secretData = generateSecret({
      name: "Big Based",
      account: email,
      length: 32,
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

    // Check for existing MFA settings
    const { data: existingSettings } = await serviceSupabase
      .from("mfa_settings")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    if (!existingSettings) {
      // Create new record
      const insertPayload = {
        id: userId,
        mfa_enabled: false,
        mfa_type: null,
        authenticator_secret: secretData.secret,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error: insertError } = await serviceSupabase.from("mfa_settings").insert(insertPayload)

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
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (updateError) {
        console.error("Failed to update MFA settings:", updateError)
        throw updateError
      }
    }

    return {
      success: true,
      data: {
        secret: secretData.secret,
        qrCode: qrCodeDataUrl,
      },
    }
  } catch (error) {
    console.error("Error in generateAuthenticatorSecret:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate authenticator secret",
    }
  }
}

// Verify authenticator token and enable MFA
export async function verifyAndEnableMfa(token: string) {
  try {
    console.log("=== verifyAndEnableMfa called ===")
    const { userId } = await getAuthenticatedUser()
    const serviceSupabase = createServiceRoleClient()

    // Get the secret from the database
    const { data: mfaData, error: mfaError } = await serviceSupabase
      .from("mfa_settings")
      .select("authenticator_secret")
      .eq("id", userId)
      .single()

    if (mfaError || !mfaData?.authenticator_secret) {
      throw new Error("MFA not set up - please generate a new QR code")
    }

    // Verify the token
    const verified = verifyToken(mfaData.authenticator_secret, token)

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
    console.log("=== generateBackupCodes called ===")
    const { userId } = await getAuthenticatedUser()
    const serviceSupabase = createServiceRoleClient()

    console.log("Deleting existing backup codes for user:", userId)
    // Delete existing backup codes
    const { error: deleteError } = await serviceSupabase.from("backup_codes").delete().eq("user_id", userId)

    if (deleteError) {
      console.error("Error deleting existing backup codes:", deleteError)
    }

    console.log("Generating 10 new backup codes...")
    // Generate 10 new backup codes
    const codes = Array(10)
      .fill(0)
      .map(() => {
        const bytes = randomBytes(9) // 9 bytes = 18 hex chars
        const hex = bytes.toString("hex")
        // Format as XXXX-XXXX-XXXX
        return `${hex.substring(0, 4)}-${hex.substring(4, 8)}-${hex.substring(8, 12)}`.toUpperCase()
      })

    console.log("Generated codes:", codes.length)

    // Hash the codes for storage
    const hashedCodes = codes.map((code) => {
      return {
        user_id: userId,
        code: createHash("sha256").update(code).digest("hex"),
        is_used: false,
        created_at: new Date().toISOString(),
      }
    })

    console.log("Inserting hashed backup codes...")
    // Store the hashed codes
    const { data: insertData, error: insertError } = await serviceSupabase
      .from("backup_codes")
      .insert(hashedCodes)
      .select()

    console.log("Backup codes insert result:", { insertData, insertError })

    if (insertError) {
      console.error("Failed to insert backup codes:", insertError)
      throw insertError
    }

    console.log("Backup codes generated successfully")
    return {
      success: true,
      data: { codes },
    }
  } catch (error) {
    console.error("Error generating backup codes:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate backup codes",
    }
  }
}

// Verify backup code
export async function verifyBackupCode(code: string) {
  try {
    const { userId } = await getAuthenticatedUser()
    const serviceSupabase = createServiceRoleClient()

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
    const { userId } = await getAuthenticatedUser()
    const serviceSupabase = createServiceRoleClient()

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

// Check if user has MFA enabled (for login flow)
export async function checkUserMfaStatus(email: string) {
  try {
    console.log("=== checkUserMfaStatus ===", email)
    const serviceSupabase = createServiceRoleClient()

    // Get user by email first
    const { data: userData, error: userError } = await serviceSupabase.auth.admin.listUsers()

    if (userError) {
      console.error("Error listing users:", userError)
      return {
        success: false,
        error: "Failed to check user",
      }
    }

    const user = userData.users.find((u) => u.email === email)

    if (!user) {
      console.log("User not found for email:", email)
      return {
        success: false,
        error: "User not found",
      }
    }

    console.log("Found user:", user.id)

    // Check MFA status
    const { data: mfaData, error: mfaError } = await serviceSupabase
      .from("mfa_settings")
      .select("mfa_enabled, mfa_type")
      .eq("id", user.id)
      .maybeSingle()

    if (mfaError) {
      console.log("No MFA settings found, assuming disabled")
      return {
        success: true,
        data: {
          enabled: false,
          type: null,
        },
      }
    }

    const result = {
      success: true,
      data: {
        enabled: mfaData?.mfa_enabled || false,
        type: mfaData?.mfa_type || null,
      },
    }

    console.log("MFA status result:", result)
    return result
  } catch (error) {
    console.error("Error checking user MFA status:", error)
    return {
      success: false,
      error: "Failed to check MFA status",
    }
  }
}

// Verify MFA token for login
export async function verifyMfaForLogin(email: string, token: string) {
  try {
    console.log("=== verifyMfaForLogin ===", email, "token length:", token.length)
    const serviceSupabase = createServiceRoleClient()

    // Get user by email
    const { data: userData, error: userError } = await serviceSupabase.auth.admin.listUsers()

    if (userError) {
      console.error("Error listing users:", userError)
      return {
        success: false,
        error: "Failed to find user",
      }
    }

    const user = userData.users.find((u) => u.email === email)

    if (!user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    // Get MFA secret
    const { data: mfaData, error: mfaError } = await serviceSupabase
      .from("mfa_settings")
      .select("authenticator_secret")
      .eq("id", user.id)
      .single()

    if (mfaError || !mfaData?.authenticator_secret) {
      console.error("MFA secret not found:", mfaError)
      return {
        success: false,
        error: "MFA not set up",
      }
    }

    console.log("Found MFA secret, verifying token...")

    // Verify the token
    const verified = verifyToken(mfaData.authenticator_secret, token)
    console.log("Token verification result:", verified)

    if (!verified || verified.delta !== 0) {
      return {
        success: false,
        error: "Invalid verification code",
      }
    }

    console.log("MFA verification successful!")
    return { success: true }
  } catch (error) {
    console.error("Error verifying MFA for login:", error)
    return {
      success: false,
      error: "Failed to verify MFA",
    }
  }
}
