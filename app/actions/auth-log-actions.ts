"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import type { AuthEvent, AuthStatus } from "@/app/constants/auth-constants"

export async function logAuthEvent(
  userId: string,
  event: AuthEvent,
  status: AuthStatus,
  metadata?: Record<string, any>,
) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { error } = await supabase.from("auth_logs").insert({
      user_id: userId,
      event,
      status,
      metadata: metadata || {},
      ip_address: "127.0.0.1", // In production, get from headers
      user_agent: "Unknown", // In production, get from headers
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Failed to log auth event:", error)
    }
  } catch (error) {
    console.error("Error logging auth event:", error)
  }
}

export async function getAuthLogs(userId: string, limit = 50) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data, error } = await supabase
      .from("auth_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Error getting auth logs:", error)
    return {
      success: false,
      error: "Failed to get auth logs",
    }
  }
}

export async function clearAuthLogs(userId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { error } = await supabase.from("auth_logs").delete().eq("user_id", userId)

    if (error) throw error

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error clearing auth logs:", error)
    return {
      success: false,
      error: "Failed to clear auth logs",
    }
  }
}
