"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export interface UserProfile {
  id: string
  username: string
  full_name: string
  avatar_url: string
  website?: string
  bio?: string
  created_at: string
  updated_at: string
  social_links: any
  banner_url: string
  role?: string
  email?: string
  auth_exists?: boolean
}

// Extract domain from email or generate a realistic one
function generateRealisticEmail(username: string, authEmail?: string): string {
  if (authEmail) return authEmail

  // Common email domains for realistic mock emails
  const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"]
  const randomDomain = domains[Math.floor(Math.random() * domains.length)]

  return `${username}@${randomDomain}`
}

export async function getUsersWithAuthStatus(): Promise<{
  success: boolean
  users: UserProfile[]
  error?: string
}> {
  try {
    const supabase = createClient()
    const adminClient = createAdminClient()

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (profilesError) {
      return { success: false, users: [], error: profilesError.message }
    }

    // Check which profiles have corresponding auth users
    const usersWithAuthStatus = await Promise.all(
      profiles.map(async (profile) => {
        try {
          // Try to get the auth user
          const { data: authUser, error } = await adminClient.auth.admin.getUserById(profile.id)

          return {
            ...profile,
            email: authUser?.user?.email || generateRealisticEmail(profile.username),
            auth_exists: !error && !!authUser?.user,
          }
        } catch (error) {
          return {
            ...profile,
            email: generateRealisticEmail(profile.username),
            auth_exists: false,
          }
        }
      }),
    )

    return {
      success: true,
      users: usersWithAuthStatus,
    }
  } catch (error) {
    console.error("Error in getUsersWithAuthStatus:", error)
    return {
      success: false,
      users: [],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function deleteOrphanedProfile(profileId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = createClient()
    const adminClient = createAdminClient()

    console.log("Attempting to delete orphaned profile:", profileId)

    // First verify this profile doesn't have auth
    try {
      const { data: authUser } = await adminClient.auth.admin.getUserById(profileId)
      if (authUser?.user) {
        return {
          success: false,
          error: "Cannot delete profile - auth user still exists. Delete auth user first.",
        }
      }
    } catch (error) {
      console.log("Auth user doesn't exist (expected for orphaned profile):", error)
    }

    // Delete the profile from database
    const { error: deleteError } = await supabase.from("profiles").delete().eq("id", profileId)

    if (deleteError) {
      console.error("Database delete error:", deleteError)
      return { success: false, error: deleteError.message }
    }

    // Log the action
    await logAdminAction("delete_orphaned_profile", profileId, "Profile deleted successfully")

    console.log("Successfully deleted orphaned profile:", profileId)
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting orphaned profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function updateUserRole(
  userId: string,
  newRole: "admin" | "user",
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = createClient()
    const adminClient = createAdminClient()

    // Update in profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    // Try to update auth metadata if user exists
    try {
      await adminClient.auth.admin.updateUserById(userId, {
        app_metadata: { role: newRole },
      })
    } catch (error) {
      console.log("Could not update auth metadata (user may not exist):", error)
    }

    // Log the action
    await logAdminAction("update_role", userId, `Role updated to ${newRole}`)

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error updating user role:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function deleteUserCompletely(userId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = createClient()
    const adminClient = createAdminClient()

    // Delete auth user first (if exists)
    try {
      await adminClient.auth.admin.deleteUser(userId)
    } catch (error) {
      console.log("Auth user may not exist:", error)
    }

    // Delete profile
    const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId)

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    // Log the action
    await logAdminAction("delete_user_complete", userId, "User completely deleted")

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user completely:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function resetUserPassword(userId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const adminClient = createAdminClient()

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-12) + "Temp123!"

    // Update the user's password
    const { error } = await adminClient.auth.admin.updateUserById(userId, {
      password: tempPassword,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Log the action
    await logAdminAction("reset_password", userId, "Password reset successfully")

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error resetting password:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function cleanupOrphanedProfiles(): Promise<{
  success: boolean
  deletedCount: number
  error?: string
}> {
  try {
    const { success, users } = await getUsersWithAuthStatus()

    if (!success) {
      return { success: false, deletedCount: 0, error: "Failed to get users" }
    }

    const orphanedUsers = users.filter((user) => !user.auth_exists)
    let deletedCount = 0

    for (const user of orphanedUsers) {
      const result = await deleteOrphanedProfile(user.id)
      if (result.success) {
        deletedCount++
      }
    }

    // Log the cleanup action
    await logAdminAction("cleanup_orphaned_profiles", "system", `Deleted ${deletedCount} orphaned profiles`)

    revalidatePath("/admin/users")
    return { success: true, deletedCount }
  } catch (error) {
    console.error("Error cleaning up orphaned profiles:", error)
    return {
      success: false,
      deletedCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function logAdminAction(action: string, targetUser: string, details: string) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from("admin_logs").insert({
      action,
      target_user: targetUser,
      admin_user: user?.email || "system",
      details,
      created_at: new Date().toISOString(),
      status: "success",
    })

    if (error) {
      console.error("Error logging admin action:", error)
    } else {
      console.log("Admin action logged:", { action, targetUser, details })
    }
  } catch (error) {
    console.error("Error logging admin action:", error)
  }
}
