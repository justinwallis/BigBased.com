"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Profile {
  id: string
  email?: string
  username: string
  full_name: string
  bio: string
  avatar_url: string
  banner_url: string
  banner_position: string
  website?: string
  location?: string
  social_links: any
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

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
      email: profileData.email,
      username,
      full_name: profileData.full_name || "",
      avatar_url: avatarUrl,
      bio: "",
      banner_url: "",
      banner_position: "center",
      website: "",
      location: "",
      social_links: {},
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

export async function checkUsernameAvailability(
  username: string,
  currentUserId?: string,
): Promise<{
  available: boolean
  error?: string
}> {
  try {
    if (!username || username.trim().length === 0) {
      return { available: false, error: "Username cannot be empty" }
    }

    // Basic username validation
    const usernameRegex = /^[a-zA-Z0-9_-]+$/
    if (!usernameRegex.test(username)) {
      return { available: false, error: "Username can only contain letters, numbers, hyphens, and underscores" }
    }

    if (username.length < 3) {
      return { available: false, error: "Username must be at least 3 characters long" }
    }

    if (username.length > 30) {
      return { available: false, error: "Username must be less than 30 characters long" }
    }

    const supabase = createServerSupabaseClient()

    // Check if username exists (excluding current user if provided)
    let query = supabase.from("profiles").select("id").eq("username", username)

    if (currentUserId) {
      query = query.neq("id", currentUserId)
    }

    const { data, error } = await query.single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows returned
      console.error("Error checking username availability:", error)
      return { available: false, error: "Error checking username availability" }
    }

    // If data exists, username is taken
    const available = !data

    return { available }
  } catch (error) {
    console.error("Error in checkUsernameAvailability:", error)
    return {
      available: false,
      error: error instanceof Error ? error.message : "Unknown error checking username",
    }
  }
}

export async function updateCurrentUserProfile(profileData: {
  username?: string
  full_name?: string
  bio?: string
  avatar_url?: string
  banner_url?: string
  banner_position?: string
  website?: string
  location?: string
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

    // Check username availability if username is being updated
    if (profileData.username) {
      const usernameCheck = await checkUsernameAvailability(profileData.username, user.id)
      if (!usernameCheck.available) {
        return {
          success: false,
          error: usernameCheck.error || "Username is already taken",
        }
      }
    }

    console.log("Updating profile for user:", user.id)

    // First, check if profile exists
    const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const insertData = {
        id: user.id,
        email: user.email,
        username: profileData.username || user.email?.split("@")[0] || "",
        full_name: profileData.full_name || "",
        bio: profileData.bio || "",
        avatar_url: profileData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`,
        banner_url: profileData.banner_url || "",
        banner_position: profileData.banner_position || "center",
        website: profileData.website || "",
        location: profileData.location || "",
        social_links: profileData.social_links || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("Creating new profile with data:", insertData)

      const { error: insertError } = await supabase.from("profiles").insert(insertData)

      if (insertError) {
        console.error("Error creating profile:", insertError)
        return { success: false, error: insertError.message }
      }
    } else {
      // Update existing profile using raw SQL to bypass schema cache issues
      console.log("Updating existing profile")

      // Use raw SQL query to avoid schema cache issues
      const { error: updateError } = await supabase.rpc("update_user_profile", {
        user_id: user.id,
        profile_data: {
          username: profileData.username,
          full_name: profileData.full_name,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url,
          banner_url: profileData.banner_url,
          banner_position: profileData.banner_position,
          website: profileData.website,
          location: profileData.location,
          social_links: profileData.social_links,
          updated_at: new Date().toISOString(),
        },
      })

      if (updateError) {
        console.error("RPC update failed, trying direct update:", updateError)

        // Fallback to direct update with explicit column names
        const updateData: any = {
          updated_at: new Date().toISOString(),
        }

        if (profileData.username !== undefined) updateData.username = profileData.username
        if (profileData.full_name !== undefined) updateData.full_name = profileData.full_name
        if (profileData.bio !== undefined) updateData.bio = profileData.bio
        if (profileData.avatar_url !== undefined) updateData.avatar_url = profileData.avatar_url
        if (profileData.banner_url !== undefined) updateData.banner_url = profileData.banner_url
        if (profileData.website !== undefined) updateData.website = profileData.website
        if (profileData.location !== undefined) updateData.location = profileData.location
        if (profileData.social_links !== undefined) updateData.social_links = profileData.social_links

        // Try updating without banner_position first
        const { error: fallbackError } = await supabase.from("profiles").update(updateData).eq("id", user.id)

        if (fallbackError) {
          console.error("Fallback update failed:", fallbackError)
          return { success: false, error: fallbackError.message }
        }

        // If that worked, try to update banner_position separately
        if (profileData.banner_position !== undefined) {
          const { error: bannerError } = await supabase
            .from("profiles")
            .update({ banner_position: profileData.banner_position })
            .eq("id", user.id)

          if (bannerError) {
            console.error("Banner position update failed:", bannerError)
            // Don't fail the whole operation for this
          }
        }
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

export async function getCurrentUserProfile(): Promise<Profile | null> {
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
          email: user.email,
          username: user.email?.split("@")[0] || "",
          full_name: "",
          bio: "",
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`,
          banner_url: "",
          banner_position: "center",
          website: "",
          location: "",
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

export async function getUserProfileByUsername(username: string): Promise<Profile | null> {
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

export async function getUserProfile(userId: string): Promise<Profile | null> {
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
