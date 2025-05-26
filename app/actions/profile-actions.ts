"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createProfile(profileData: {
  id: string
  email: string
  username?: string
  full_name?: string
  avatar_url?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    // Generate a username if not provided
    const username = profileData.username || profileData.email.split("@")[0]

    // Generate avatar URL if not provided
    const avatarUrl = profileData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`

    const { error } = await supabase.from("profiles").insert({
      id: profileData.id,
      username,
      full_name: profileData.full_name || "",
      avatar_url: avatarUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error creating profile:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error in createProfile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error creating profile",
    }
  }
}

export async function updateCurrentUserProfile(profileData: {
  username?: string
  full_name?: string
  avatar_url?: string
  website?: string
  bio?: string
}): Promise<{ success: boolean; error?: string; debug?: any }> {
  try {
    const supabase = createServerSupabaseClient()

    // Debug: Log available cookies
    console.log(
      "Available cookies:",
      Object.fromEntries(
        Array.from(
          require("next/headers")
            .cookies()
            .getAll()
            .map((cookie) => [cookie.name, cookie.value.substring(0, 20) + "..."]),
        ),
      ),
    )

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log("Auth user result:", { user: user?.id, error: userError?.message })

    if (userError || !user) {
      console.error("Auth error:", userError)
      return {
        success: false,
        error: "User not authenticated. Please sign in again.",
        debug: { userError: userError?.message, hasUser: !!user },
      }
    }

    console.log("Updating profile for user:", user.id)

    const { error, data } = await supabase
      .from("profiles")
      .update({
        username: profileData.username,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        bio: profileData.bio,
        website: profileData.website,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()

    if (error) {
      console.error("Error updating profile:", error)
      return { success: false, error: error.message }
    }

    console.log("Profile updated successfully:", data)
    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error in updateCurrentUserProfile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error updating profile",
    }
  }
}

export async function updateUserProfile(
  id: string,
  profileData: {
    username?: string
    full_name?: string
    avatar_url?: string
    website?: string
    bio?: string
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase
      .from("profiles")
      .update({
        username: profileData.username,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        bio: profileData.bio,
        website: profileData.website,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating profile:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error in updateUserProfile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error updating profile",
    }
  }
}

export async function getUserProfile(userId: string): Promise<any> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserProfile:", error)
    return null
  }
}

export async function getCurrentUserProfile(): Promise<any> {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Error getting current user:", userError)
      return null
    }

    // Get their profile
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching current user profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getCurrentUserProfile:", error)
    return null
  }
}
