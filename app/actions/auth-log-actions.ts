"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies, headers } from "next/headers"
import { AUTH_EVENTS, AUTH_STATUS } from "@/app/constants/auth-log-constants"

// Re-export constants for backward compatibility
export { AUTH_EVENTS, AUTH_STATUS }

// Log an authentication event
export async function logAuthEvent(
  userId: string | null,
  eventType: string,
  status: string,
  details: Record<string, any> = {},
) {
  try {
    const cookieStore = cookies()
    const supabase = createServerSupabaseClient()

    // Get IP address and user agent
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Call the database function to log the event
    const { error } = await supabase.rpc("log_auth_event", {
      p_user_id: userId,
      p_event_type: eventType,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
      p_status: status,
      p_details: details,
    })

    if (error) {
      console.error("Error logging auth event:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in logAuthEvent:", error)
    return { success: false, error: "Failed to log authentication event" }
  }
}

// Get authentication logs for the current user
export async function getUserAuthLogs(
  page = 1,
  pageSize = 10,
  filters: { eventType?: string; startDate?: string; endDate?: string } = {},
) {
  try {
    const cookieStore = cookies()
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id

    // Build the query
    let query = supabase
      .from("auth_logs")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    // Apply filters
    if (filters.eventType) {
      query = query.eq("event_type", filters.eventType)
    }

    if (filters.startDate) {
      query = query.gte("created_at", filters.startDate)
    }

    if (filters.endDate) {
      query = query.lte("created_at", filters.endDate)
    }

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error("Error fetching auth logs:", error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: count ? Math.ceil(count / pageSize) : 0,
      },
    }
  } catch (error) {
    console.error("Error in getUserAuthLogs:", error)
    return { success: false, error: "Failed to fetch authentication logs" }
  }
}
