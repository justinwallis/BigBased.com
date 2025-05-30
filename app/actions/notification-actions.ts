"use server"

import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Define types for notification preferences
interface NotificationPreferences {
  userId: string
  emailPreferences: Record<string, boolean>
  pushPreferences: Record<string, boolean>
  oneSignalUserId?: string | null
  quietHoursStart?: string | null
  quietHoursEnd?: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Save a user's OneSignal ID to the database
 */
export async function saveOneSignalUserId(oneSignalUserId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id
    const sql = neon(process.env.DATABASE_URL!)

    // Check if user already has notification preferences
    const existingPrefs = await sql`
      SELECT * FROM notification_preferences WHERE user_id = ${userId}
    `

    if (existingPrefs.length > 0) {
      // Update existing record
      await sql`
        UPDATE notification_preferences 
        SET onesignal_user_id = ${oneSignalUserId}, updated_at = NOW()
        WHERE user_id = ${userId}
      `
    } else {
      // Create new record with default preferences
      await sql`
        INSERT INTO notification_preferences (
          user_id, 
          onesignal_user_id, 
          email_preferences, 
          push_preferences,
          created_at,
          updated_at
        )
        VALUES (
          ${userId}, 
          ${oneSignalUserId}, 
          ${{
            securityAlerts: true,
            loginNotifications: true,
            accountChanges: true,
            platformUpdates: true,
            newFeatures: true,
            maintenanceAlerts: true,
            communityUpdates: false,
            newMembers: false,
            communityEvents: true,
            newContent: true,
            libraryUpdates: false,
            bookRecommendations: false,
            prayerRequests: true,
            spiritualContent: false,
            dailyDevotions: false,
            newsletters: false,
            eventInvitations: true,
            specialOffers: false,
          }},
          ${{
            securityAlerts: true,
            loginNotifications: true,
            accountChanges: true,
            platformUpdates: true,
            newFeatures: true,
            maintenanceAlerts: true,
            communityUpdates: false,
            newMembers: false,
            communityEvents: true,
            newContent: true,
            libraryUpdates: false,
            bookRecommendations: false,
            prayerRequests: true,
            spiritualContent: false,
            dailyDevotions: false,
            newsletters: false,
            eventInvitations: true,
            specialOffers: false,
          }},
          NOW(),
          NOW()
        )
      `
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving OneSignal user ID:", error)
    return { success: false, error: "Failed to save OneSignal user ID" }
  }
}

/**
 * Save a user's push notification preferences
 */
export async function savePushPreferences(preferences: Record<string, boolean>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id
    const sql = neon(process.env.DATABASE_URL!)

    // Check if user already has notification preferences
    const existingPrefs = await sql`
      SELECT * FROM notification_preferences WHERE user_id = ${userId}
    `

    if (existingPrefs.length > 0) {
      // Update existing record
      await sql`
        UPDATE notification_preferences 
        SET push_preferences = ${preferences}, updated_at = NOW()
        WHERE user_id = ${userId}
      `
    } else {
      // Create new record
      await sql`
        INSERT INTO notification_preferences (
          user_id, 
          push_preferences,
          email_preferences,
          created_at,
          updated_at
        )
        VALUES (
          ${userId}, 
          ${preferences},
          ${{
            securityAlerts: true,
            loginNotifications: true,
            accountChanges: true,
            platformUpdates: true,
            newFeatures: true,
            maintenanceAlerts: true,
            communityUpdates: false,
            newMembers: false,
            communityEvents: true,
            newContent: true,
            libraryUpdates: false,
            bookRecommendations: false,
            prayerRequests: true,
            spiritualContent: false,
            dailyDevotions: false,
            newsletters: false,
            eventInvitations: true,
            specialOffers: false,
          }},
          NOW(),
          NOW()
        )
      `
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving push preferences:", error)
    return { success: false, error: "Failed to save push preferences" }
  }
}

/**
 * Save a user's email notification preferences
 */
export async function saveEmailPreferences(preferences: Record<string, boolean>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id
    const sql = neon(process.env.DATABASE_URL!)

    // Check if user already has notification preferences
    const existingPrefs = await sql`
      SELECT * FROM notification_preferences WHERE user_id = ${userId}
    `

    if (existingPrefs.length > 0) {
      // Update existing record
      await sql`
        UPDATE notification_preferences 
        SET email_preferences = ${preferences}, updated_at = NOW()
        WHERE user_id = ${userId}
      `
    } else {
      // Create new record
      await sql`
        INSERT INTO notification_preferences (
          user_id, 
          email_preferences,
          push_preferences,
          created_at,
          updated_at
        )
        VALUES (
          ${userId}, 
          ${preferences},
          ${{
            securityAlerts: true,
            loginNotifications: true,
            accountChanges: true,
            platformUpdates: true,
            newFeatures: true,
            maintenanceAlerts: true,
            communityUpdates: false,
            newMembers: false,
            communityEvents: true,
            newContent: true,
            libraryUpdates: false,
            bookRecommendations: false,
            prayerRequests: true,
            spiritualContent: false,
            dailyDevotions: false,
            newsletters: false,
            eventInvitations: true,
            specialOffers: false,
          }},
          NOW(),
          NOW()
        )
      `
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving email preferences:", error)
    return { success: false, error: "Failed to save email preferences" }
  }
}

/**
 * Get a user's notification preferences
 */
export async function getNotificationPreferences() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id
    const sql = neon(process.env.DATABASE_URL!)

    const preferences = await sql`
      SELECT * FROM notification_preferences WHERE user_id = ${userId}
    `

    if (preferences.length === 0) {
      // Return default preferences
      return {
        success: true,
        data: {
          emailPreferences: {
            securityAlerts: true,
            loginNotifications: true,
            accountChanges: true,
            platformUpdates: true,
            newFeatures: true,
            maintenanceAlerts: true,
            communityUpdates: false,
            newMembers: false,
            communityEvents: true,
            newContent: true,
            libraryUpdates: false,
            bookRecommendations: false,
            prayerRequests: true,
            spiritualContent: false,
            dailyDevotions: false,
            newsletters: false,
            eventInvitations: true,
            specialOffers: false,
          },
          pushPreferences: {
            securityAlerts: true,
            loginNotifications: true,
            accountChanges: true,
            platformUpdates: true,
            newFeatures: true,
            maintenanceAlerts: true,
            communityUpdates: false,
            newMembers: false,
            communityEvents: true,
            newContent: true,
            libraryUpdates: false,
            bookRecommendations: false,
            prayerRequests: true,
            spiritualContent: false,
            dailyDevotions: false,
            newsletters: false,
            eventInvitations: true,
            specialOffers: false,
          },
          oneSignalUserId: null,
          quietHoursStart: null,
          quietHoursEnd: null,
        },
      }
    }

    return {
      success: true,
      data: {
        emailPreferences: preferences[0].email_preferences,
        pushPreferences: preferences[0].push_preferences,
        oneSignalUserId: preferences[0].onesignal_user_id,
        quietHoursStart: preferences[0].quiet_hours_start,
        quietHoursEnd: preferences[0].quiet_hours_end,
      },
    }
  } catch (error) {
    console.error("Error getting notification preferences:", error)
    return { success: false, error: "Failed to get notification preferences" }
  }
}

/**
 * Send a test notification to a user
 */
export async function sendTestNotification() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id
    const sql = neon(process.env.DATABASE_URL!)

    console.log("Looking up OneSignal ID for user:", userId)

    // Get the user's OneSignal ID
    const preferences = await sql`
      SELECT onesignal_user_id FROM notification_preferences WHERE user_id = ${userId}
    `

    console.log("Preferences query result:", preferences)

    // Check if we have OneSignal configuration
    if (!process.env.ONESIGNAL_REST_API_KEY || !process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) {
      console.log("OneSignal not configured - this is normal for development")
      return {
        success: false,
        error: "OneSignal is not configured. Browser notifications will be used as fallback.",
      }
    }

    if (preferences.length === 0 || !preferences[0].onesignal_user_id) {
      console.log("No OneSignal ID found for user - this is normal if OneSignal isn't set up")
      return {
        success: false,
        error: "OneSignal ID not found. Browser notifications will be used as fallback.",
      }
    }

    const oneSignalUserId = preferences[0].onesignal_user_id
    console.log("Found OneSignal ID:", oneSignalUserId)

    // Call the OneSignal API to send a test notification
    console.log("Sending notification to OneSignal API")
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        include_player_ids: [oneSignalUserId],
        contents: {
          en: "🎉 Test notification successful! Your push notifications are working correctly.",
        },
        headings: {
          en: "Big Based - Test Notification",
        },
        data: {
          type: "test",
          timestamp: new Date().toISOString(),
        },
        web_url: process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com",
        chrome_web_icon: `${process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"}/icon-192x192.png`,
        firefox_icon: `${process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"}/icon-192x192.png`,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OneSignal API error:", errorData)

      // If we're missing the REST API key, provide a helpful error
      if (response.status === 401) {
        return {
          success: false,
          error: "OneSignal authentication failed. Browser notifications will be used as fallback.",
        }
      }

      throw new Error(`OneSignal API error: ${response.status}`)
    }

    const responseData = await response.json()
    console.log("OneSignal API response:", responseData)

    if (!responseData.id) {
      throw new Error("Failed to send notification - no notification ID returned")
    }

    console.log("Test notification sent successfully:", responseData.id)
    return { success: true, notificationId: responseData.id }
  } catch (error) {
    console.error("Error sending test notification:", error)
    return {
      success: false,
      error: "OneSignal service unavailable. Browser notifications will be used as fallback.",
    }
  }
}

/**
 * Send a notification to users based on their preferences
 */
export async function sendNotificationToUsers(
  notificationType: string,
  title: string,
  message: string,
  url?: string,
  data?: Record<string, any>,
) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get all users who have this notification type enabled
    const users = await sql`
      SELECT onesignal_user_id 
      FROM notification_preferences 
      WHERE onesignal_user_id IS NOT NULL 
      AND push_preferences->>${notificationType} = 'true'
    `

    if (users.length === 0) {
      return { success: true, message: "No users have this notification type enabled" }
    }

    const playerIds = users.map((user) => user.onesignal_user_id).filter(Boolean)

    if (playerIds.length === 0) {
      return { success: true, message: "No valid OneSignal user IDs found" }
    }

    // Send notification via OneSignal API
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        include_player_ids: playerIds,
        contents: {
          en: message,
        },
        headings: {
          en: title,
        },
        data: {
          type: notificationType,
          timestamp: new Date().toISOString(),
          ...data,
        },
        web_url: url || process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com",
        chrome_web_icon: `${process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"}/icon-192x192.png`,
        firefox_icon: `${process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"}/icon-192x192.png`,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OneSignal API error:", errorData)
      throw new Error(`OneSignal API error: ${response.status}`)
    }

    const responseData = await response.json()

    if (!responseData.id) {
      throw new Error("Failed to send notification - no notification ID returned")
    }

    console.log(`Notification sent to ${playerIds.length} users:`, responseData.id)
    return {
      success: true,
      notificationId: responseData.id,
      recipientCount: playerIds.length,
    }
  } catch (error) {
    console.error("Error sending notification to users:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send notification",
    }
  }
}
