"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
// Import and re-export the constants
import { AUTH_EVENTS, AUTH_STATUS } from "./auth-constants"

export { AUTH_EVENTS, AUTH_STATUS }

// Log auth events
export async function logAuthEvent(userId: string, eventType: string, status: string, metadata: any = {}) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("auth_logs").insert({
      user_id: userId,
      event_type: eventType,
      status: status,
      metadata: metadata,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error logging auth event:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in logAuthEvent:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error logging auth event",
    }
  }
}

// Get auth logs for a user
export async function getUserAuthLogs(userId: string, limit = 10) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("auth_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching auth logs:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getUserAuthLogs:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error fetching auth logs",
    }
  }
}
