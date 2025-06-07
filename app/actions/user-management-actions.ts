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
  last_known_email?: string
}

// Store last known emails for orphaned profiles
const orphanedEmailCache = new Map<string, string>()

export async function getUsersWithAuthStatus(): Promise<{
  success: boolean
  users: UserProfile[]
  error?: string
}> {
  try {
    const supabase = createClient()
    const adminClient = createAdminClient()

    console.log("🔍 Starting user fetch process...")

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (profilesError) {
      console.error("❌ Error fetching profiles:", profilesError)
      return { success: false, users: [], error: profilesError.message }
    }

    console.log(`📊 Fetched ${profiles.length} profiles from database`)

    // Get ALL auth users to cross-reference
    const { data: authData, error: authError } = await adminClient.auth.admin.listUsers()

    if (authError) {
      console.error("❌ Error fetching auth users:", authError)
      return { success: false, users: [], error: authError.message }
    }

    console.log(`🔐 Fetched ${authData.users.length} auth users`)

    // Create a map of auth users by ID for quick lookup
    const authUserMap = new Map()
    authData.users.forEach((user) => {
      authUserMap.set(user.id, user)
    })

    // Process each profile
    const usersWithAuthStatus = profiles.map((profile) => {
      const authUser = authUserMap.get(profile.id)
      const hasAuth = !!authUser
      const realEmail = authUser?.email

      // If we have a real email, store it in our cache for future reference
      if (realEmail) {
        orphanedEmailCache.set(profile.id, realEmail)
      }

      // If this profile is orphaned, try to get the last known email
      const lastKnownEmail = !hasAuth ? orphanedEmailCache.get(profile.id) : undefined

      console.log(`👤 Profile ${profile.username}: auth=${hasAuth}, email=${realEmail || lastKnownEmail || "unknown"}`)

      return {
        ...profile,
        email: realEmail || lastKnownEmail || `${profile.username}@deleted-account.local`,
        auth_exists: hasAuth,
        last_known_email: lastKnownEmail,
      }
    })

    // Also check for auth users without profiles (shouldn't happen but let's be thorough)
    const profileIds = new Set(profiles.map((p) => p.id))
    const orphanedAuthUsers = authData.users.filter((user) => !profileIds.has(user.id))

    if (orphanedAuthUsers.length > 0) {
      console.log(`⚠️ Found ${orphanedAuthUsers.length} auth users without profiles`)
    }

    console.log(`✅ Processed ${usersWithAuthStatus.length} users successfully`)

    return {
      success: true,
      users: usersWithAuthStatus,
    }
  } catch (error) {
    console.error("💥 Error in getUsersWithAuthStatus:", error)
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

    console.log("🗑️ Attempting to delete orphaned profile:", profileId)

    // Get profile info before deletion for logging - only select columns that exist
    const { data: profile, error: profileFetchError } = await supabase
      .from("profiles")
      .select("username") // Only select username, not email
      .eq("id", profileId)
      .single()

    if (profileFetchError) {
      console.error("❌ Error fetching profile before deletion:", profileFetchError)
      return { success: false, error: "Profile not found" }
    }

    console.log(`📋 Found profile to delete: ${profile.username}`)

    // Double-check this profile doesn't have auth
    try {
      const { data: authUser, error: authError } = await adminClient.auth.admin.getUserById(profileId)
      if (!authError && authUser?.user) {
        console.log("⚠️ Auth user still exists, cannot delete profile")
        return {
          success: false,
          error: "Cannot delete profile - auth user still exists. Delete auth user first.",
        }
      }
    } catch (error) {
      console.log("✅ Confirmed: Auth user doesn't exist (expected for orphaned profile)")
    }

    // Delete the profile from database
    console.log("🔥 Executing database deletion...")
    const { error: deleteError, count } = await supabase.from("profiles").delete({ count: "exact" }).eq("id", profileId)

    if (deleteError) {
      console.error("❌ Database delete error:", deleteError)
      return { success: false, error: deleteError.message }
    }

    console.log(`✅ Database deletion result: ${count} rows affected`)

    if (count === 0) {
      console.log("⚠️ No rows were deleted - profile may not exist")
      return { success: false, error: "Profile not found or already deleted" }
    }

    // Log the action
    await logAdminAction("delete_orphaned_profile", profile.username, "Profile deleted successfully")

    console.log("🎉 Successfully deleted orphaned profile:", profileId)

    // Force revalidation
    revalidatePath("/admin/users")
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("💥 Error deleting orphaned profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function restoreUserAccount(
  profileId: string,
  email: string,
  password = "",
): Promise<{
  success: boolean
  error?: string
  tempPassword?: string
}> {
  try {
    const supabase = createClient()
    const adminClient = createAdminClient()

    console.log("🔄 Attempting to restore account for profile:", profileId)

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .single()

    if (profileError) {
      console.error("❌ Error fetching profile:", profileError)
      return { success: false, error: "Profile not found" }
    }

    // Check if auth user already exists
    try {
      const { data: existingUser } = await adminClient.auth.admin.getUserById(profileId)
      if (existingUser?.user) {
        return {
          success: false,
          error: "Auth user already exists for this profile. No restoration needed.",
        }
      }
    } catch (error) {
      // This is expected - the auth user shouldn't exist
      console.log("✅ Confirmed: No auth user exists (good for restoration)")
    }

    // Check if email is already in use by another user
    try {
      const { data: emailCheck } = await adminClient.auth.admin.listUsers()
      const emailInUse = emailCheck.users.some((user) => user.email === email && user.id !== profileId)

      if (emailInUse) {
        return {
          success: false,
          error: `Email ${email} is already in use by another account. Please use a different email.`,
        }
      }
    } catch (error) {
      console.warn("Could not check email uniqueness:", error)
    }

    // Generate a secure password if none provided
    const actualPassword = password || Math.random().toString(36).slice(-12) + "Temp123!"
    const isGeneratedPassword = !password

    console.log("🔐 Creating auth user with email:", email)

    // Try creating the user without specifying the UID first
    let newUser
    let createError

    try {
      // First attempt: Create user without specifying UID
      const createResult = await adminClient.auth.admin.createUser({
        email: email,
        password: actualPassword,
        email_confirm: true,
        user_metadata: {
          restored: true,
          restored_at: new Date().toISOString(),
          username: profile.username,
          full_name: profile.full_name,
          original_profile_id: profileId,
        },
        app_metadata: {
          role: profile.role || "user",
        },
      })

      newUser = createResult.data
      createError = createResult.error

      if (!createError && newUser?.user) {
        console.log("✅ Created new auth user with new ID:", newUser.user.id)

        // Update the profile to use the new auth user ID
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            id: newUser.user.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profileId)

        if (updateError) {
          console.error("❌ Error updating profile with new ID:", updateError)
          // Try to delete the created auth user to avoid orphaned auth
          try {
            await adminClient.auth.admin.deleteUser(newUser.user.id)
          } catch (cleanupError) {
            console.error("Failed to cleanup created auth user:", cleanupError)
          }
          return { success: false, error: "Failed to update profile with new auth ID" }
        }

        console.log("✅ Successfully updated profile with new auth ID")
      }
    } catch (error) {
      console.log("First attempt failed, trying with original UID...")
      createError = error
    }

    // If first attempt failed, try with the original UID
    if (createError) {
      try {
        const createResult = await adminClient.auth.admin.createUser({
          uid: profileId,
          email: email,
          password: actualPassword,
          email_confirm: true,
          user_metadata: {
            restored: true,
            restored_at: new Date().toISOString(),
            username: profile.username,
            full_name: profile.full_name,
          },
          app_metadata: {
            role: profile.role || "user",
          },
        })

        newUser = createResult.data
        createError = createResult.error

        if (!createError && newUser?.user) {
          console.log("✅ Successfully created auth user with original ID:", profileId)

          // Update the profile timestamp
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              updated_at: new Date().toISOString(),
            })
            .eq("id", profileId)

          if (updateError) {
            console.warn("⚠️ Warning: Could not update profile timestamp:", updateError)
            // Non-fatal, continue
          }
        }
      } catch (secondError) {
        console.error("❌ Both attempts failed:", secondError)
        return {
          success: false,
          error: `Failed to create auth user. Original error: ${createError?.message || "Unknown"}. Second attempt: ${secondError instanceof Error ? secondError.message : "Unknown"}`,
        }
      }
    }

    if (createError || !newUser?.user) {
      console.error("❌ Error creating auth user:", createError)
      return {
        success: false,
        error: createError?.message || "Failed to create auth user",
      }
    }

    // Log the action
    await logAdminAction("restore_account", profile.username, `Account restored with email ${email}`)

    // Force revalidation
    revalidatePath("/admin/users")
    revalidatePath("/admin")

    return {
      success: true,
      tempPassword: isGeneratedPassword ? actualPassword : undefined,
    }
  } catch (error) {
    console.error("💥 Error restoring user account:", error)
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

    // Get username for logging
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", userId).single()

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
    await logAdminAction("update_role", profile?.username || userId, `Role updated to ${newRole}`)

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

    // Get username for logging
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", userId).single()

    console.log("🗑️ Deleting user completely:", profile?.username || userId)

    // Get the email before deletion for our cache
    try {
      const { data: authUser } = await adminClient.auth.admin.getUserById(userId)
      if (authUser?.user?.email) {
        // Store the email in our cache for future restoration
        orphanedEmailCache.set(userId, authUser.user.email)
        console.log(`📝 Cached email ${authUser.user.email} for possible future restoration`)
      }
    } catch (error) {
      console.log("Could not cache email (user may not exist):", error)
    }

    // Delete auth user first (if exists)
    try {
      const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId)
      if (authDeleteError) {
        console.log("Auth deletion error:", authDeleteError)
      } else {
        console.log("✅ Auth user deleted")
      }
    } catch (error) {
      console.log("Auth user may not exist:", error)
    }

    // We don't delete the profile - we keep it as orphaned
    console.log("✅ Profile kept as orphaned for possible future restoration")

    // Log the action
    await logAdminAction("delete_user_auth", profile?.username || userId, "User auth deleted, profile kept as orphaned")

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
    const supabase = createClient()

    // Get username for logging
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", userId).single()

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
    await logAdminAction("reset_password", profile?.username || userId, "Password reset successfully")

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
    console.log("🧹 Starting cleanup of orphaned profiles...")

    const { success, users } = await getUsersWithAuthStatus()

    if (!success) {
      return { success: false, deletedCount: 0, error: "Failed to get users" }
    }

    const orphanedUsers = users.filter((user) => !user.auth_exists)
    console.log(`🎯 Found ${orphanedUsers.length} orphaned profiles to delete`)

    let deletedCount = 0

    for (const user of orphanedUsers) {
      console.log(`🗑️ Deleting orphaned profile: ${user.username} (${user.id})`)
      const result = await deleteOrphanedProfile(user.id)
      if (result.success) {
        deletedCount++
        console.log(`✅ Successfully deleted: ${user.username}`)
      } else {
        console.log(`❌ Failed to delete: ${user.username} - ${result.error}`)
      }
    }

    // Log the action
    await logAdminAction("cleanup_orphaned_profiles", "system", `Deleted ${deletedCount} orphaned profiles`)

    console.log(`🎉 Cleanup complete: ${deletedCount}/${orphanedUsers.length} profiles deleted`)

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
      console.log("📝 Admin action logged successfully:", { action, targetUser, details })
    }
  } catch (error) {
    console.error("Error logging admin action:", error)
  }
}
