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
  social_links?: any
}): Promise<{ success: boolean; error?: string; debug?: any }> {
  try {
    const supabase = createServerSupabaseClient()

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

    // First, check if profile exists
    const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        username: profileData.username || user.email?.split("@")[0] || "",
        full_name: profileData.full_name || "",
        avatar_url: profileData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`,
        bio: profileData.bio || "",
        website: profileData.website || "",
        social_links: profileData.social_links || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Error creating profile:", insertError)
        return { success: false, error: insertError.message }
      }
    } else {
      // Update existing profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: profileData.username,
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          bio: profileData.bio,
          website: profileData.website,
          social_links: profileData.social_links,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) {
        console.error("Error updating profile:", updateError)
        return { success: false, error: updateError.message }
      }
    }

    console.log("Profile operation completed successfully")
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
    social_links?: any
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
        social_links: profileData.social_links,
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

    console.log("getCurrentUserProfile - Auth user result:", { user: user?.id, error: userError?.message })

    if (userError || !user) {
      console.error("Error getting current user:", userError)
      return null
    }

    // Get their profile
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching current user profile:", error)

      // If profile doesn't exist, create a default one
      if (error.code === "PGRST116") {
        // No rows returned
        console.log("Profile doesn't exist, creating default profile")
        const defaultProfile = {
          id: user.id,
          username: user.email?.split("@")[0] || "",
          full_name: "",
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`,
          bio: "",
          website: "",
          social_links: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { error: insertError } = await supabase.from("profiles").insert(defaultProfile)

        if (insertError) {
          console.error("Error creating default profile:", insertError)
          return null
        }

        return defaultProfile
      }

      return null
    }

    console.log("Profile fetched successfully:", data)
    return data
  } catch (error) {
    console.error("Error in getCurrentUserProfile:", error)
    return null
  }
}

export async function getUserProfileByUsername(username: string): Promise<any> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single()

    if (error) {
      console.error("Error fetching profile by username:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserProfileByUsername:", error)
    return null
  }
}
