"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies, headers } from "next/headers"
import { createHash } from "crypto"
import { logAuthEvent, AUTH_EVENTS, AUTH_STATUS } from "./auth-log-actions"

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

// Generate a device fingerprint
export async function generateDeviceFingerprint(userAgent: string, ip: string, additionalData = "") {
  const data = `${userAgent}|${ip}|${additionalData}`
  return createHash("sha256").update(data).digest("hex")
}

// Trust current device
export async function trustDevice(deviceName = "My Device", expirationDays = 30) {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    // Get IP and user agent
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Generate a fingerprint for this device
    const fingerprint = generateDeviceFingerprint(userAgent, ipAddress)

    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expirationDays)

    // Check if this device is already trusted
    const { data: existingDevice } = await supabase
      .from("trusted_devices")
      .select("id")
      .eq("user_id", userId)
      .eq("device_fingerprint", fingerprint)
      .single()

    if (existingDevice) {
      // Update existing trusted device
      const { error } = await supabase
        .from("trusted_devices")
        .update({
          device_name: deviceName,
          ip_address: ipAddress,
          user_agent: userAgent,
          last_used_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq("id", existingDevice.id)

      if (error) throw error
    } else {
      // Insert new trusted device
      const { error } = await supabase.from("trusted_devices").insert({
        user_id: userId,
        device_fingerprint: fingerprint,
        device_name: deviceName,
        ip_address: ipAddress,
        user_agent: userAgent,
        expires_at: expiresAt.toISOString(),
      })

      if (error) throw error
    }

    // Log the event
    await logAuthEvent(userId, AUTH_EVENTS.DEVICE_TRUSTED, AUTH_STATUS.SUCCESS, {
      device_name: deviceName,
      expiration_days: expirationDays,
    })

    return { success: true }
  } catch (error) {
    console.error("Error trusting device:", error)
    return { success: false, error: "Failed to trust device" }
  }
}

// Check if current device is trusted
export async function isDeviceTrusted(userId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get IP and user agent
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Generate a fingerprint for this device
    const fingerprint = generateDeviceFingerprint(userAgent, ipAddress)

    // Check if this device is trusted and not expired
    const { data, error } = await supabase
      .from("trusted_devices")
      .select("id, device_name, expires_at")
      .eq("user_id", userId)
      .eq("device_fingerprint", fingerprint)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) {
      return { trusted: false }
    }

    // Update last used timestamp
    await supabase
      .from("trusted_devices")
      .update({
        last_used_at: new Date().toISOString(),
      })
      .eq("id", data.id)

    return {
      trusted: true,
      deviceName: data.device_name,
      expiresAt: data.expires_at,
    }
  } catch (error) {
    console.error("Error checking trusted device:", error)
    return { trusted: false }
  }
}

// Get all trusted devices for the current user
export async function getTrustedDevices() {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from("trusted_devices")
      .select("id, device_name, ip_address, user_agent, last_used_at, expires_at, created_at")
      .eq("user_id", userId)
      .order("last_used_at", { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data.map((device) => ({
        ...device,
        isExpired: new Date(device.expires_at) < new Date(),
      })),
    }
  } catch (error) {
    console.error("Error getting trusted devices:", error)
    return { success: false, error: "Failed to get trusted devices" }
  }
}

// Remove a trusted device
export async function removeTrustedDevice(deviceId: number) {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    // Verify the device belongs to the user
    const { data: device, error: checkError } = await supabase
      .from("trusted_devices")
      .select("device_name")
      .eq("id", deviceId)
      .eq("user_id", userId)
      .single()

    if (checkError || !device) {
      return { success: false, error: "Device not found" }
    }

    // Delete the device
    const { error } = await supabase.from("trusted_devices").delete().eq("id", deviceId)

    if (error) throw error

    // Log the event
    await logAuthEvent(userId, AUTH_EVENTS.DEVICE_REMOVED, AUTH_STATUS.SUCCESS, {
      device_name: device.device_name,
    })

    return { success: true }
  } catch (error) {
    console.error("Error removing trusted device:", error)
    return { success: false, error: "Failed to remove trusted device" }
  }
}

// Remove all trusted devices
export async function removeAllTrustedDevices() {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    const { error } = await supabase.from("trusted_devices").delete().eq("user_id", userId)

    if (error) throw error

    // Log the event
    await logAuthEvent(userId, AUTH_EVENTS.ALL_DEVICES_REMOVED, AUTH_STATUS.SUCCESS, {})

    return { success: true }
  } catch (error) {
    console.error("Error removing all trusted devices:", error)
    return { success: false, error: "Failed to remove all trusted devices" }
  }
}
