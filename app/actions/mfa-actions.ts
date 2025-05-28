"use server"

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

    console.log("Auth check - Environment variables:", {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseKey,
    })

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

    console.log("Getting user with auth client...")
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    console.log("Auth result:", {
      hasUser: !!user,
      userId: user?.id,
      error: error?.message,
    })

    if (error || !user) {
      throw new Error(`Not authenticated: ${error?.message || "No user found"}`)
    }

    return { userId: user.id, user }
  } catch (error) {
    console.error("Error in getAuthenticatedUser:", error)
    throw error
  }
}

// Helper to create service role client
function createServiceRoleClient() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log("Creating service role client:", {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!serviceRoleKey,
      serviceKeyPrefix: serviceRoleKey?.substring(0, 20) + "...",
    })

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase service role environment variables")
    }

    const cookieStore = cookies()

    const client = createServerClient<Database>(supabaseUrl, serviceRoleKey, {
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

    console.log("Service role client created successfully")
    return client
  } catch (error) {
    console.error("Error creating service role client:", error)
    throw error
  }
}

// Get MFA status for the current user
export async function getMfaStatus() {
  try {
    console.log("=== getMfaStatus called ===")
    const { userId } = await getAuthenticatedUser()
    const serviceSupabase = createServiceRoleClient()

    console.log("Checking MFA status for user:", userId)

    const { data, error } = await serviceSupabase
      .from("mfa_settings")
      .select("mfa_enabled, mfa_type")
      .eq("id", userId)
      .single()

    console.log("MFA status query result:", { data, error })

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

      console.log("Created new MFA settings record")
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
    console.log("Input email:", email)

    console.log("Step 1: Getting authenticated user...")
    const { userId } = await getAuthenticatedUser()
    console.log("Authenticated user ID:", userId)

    console.log("Step 2: Creating service role client...")
    const serviceSupabase = createServiceRoleClient()
    console.log("Service role client created")

    console.log("Step 3: Generating secret...")
    const secretData = generateSecret({
      name: "Big Based",
      account: email,
      length: 32,
    })

    console.log("Generated secret data:", {
      hasSecret: !!secretData.secret,
      hasUri: !!secretData.uri,
      secretLength: secretData.secret?.length,
      uriLength: secretData.uri?.length,
    })

    if (!secretData.secret || !secretData.uri) {
      throw new Error("Failed to generate secret or URI")
    }

    console.log("Step 4: Generating QR code...")
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

    console.log("Step 5: Checking for existing MFA settings...")
    const { data: existingSettings, error: selectError } = await serviceSupabase
      .from("mfa_settings")
      .select("id")
      .eq("id", userId)
      .single()

    console.log("Existing settings check:", {
      hasData: !!existingSettings,
      error: selectError,
    })

    if (!existingSettings) {
      console.log("Step 6a: Creating new MFA settings record for user:", userId)
      const { data: insertData, error: insertError } = await serviceSupabase
        .from("mfa_settings")
        .insert({
          id: userId,
          mfa_enabled: false,
          mfa_type: null,
          authenticator_secret: secretData.secret,
        })
        .select()

      console.log("Insert result:", { insertData, insertError })

      if (insertError) {
        console.error("Failed to create MFA settings:", insertError)
        throw insertError
      }
    } else {
      console.log("Step 6b: Updating existing MFA settings record for user:", userId)
      const { data: updateData, error: updateError } = await serviceSupabase
        .from("mfa_settings")
        .update({
          authenticator_secret: secretData.secret,
        })
        .eq("id", userId)
        .select()

      console.log("Update result:", { updateData, updateError })

      if (updateError) {
        console.error("Failed to update MFA settings:", updateError)
        throw updateError
      }
    }

    console.log("Step 7: Secret stored successfully for user:", userId)

    return {
      success: true,
      data: {
        secret: secretData.secret,
        qrCode: qrCodeDataUrl,
      },
    }
  } catch (error) {
    console.error("Error in generateAuthenticatorSecret:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
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
    console.log("=== generateBackupCodes called ===")
    const { userId } = await getAuthenticatedUser()
    const serviceSupabase = createServiceRoleClient()

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
