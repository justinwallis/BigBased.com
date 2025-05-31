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
  banner_position?: string
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
  social_links?: any
  personal_info?: any
  location?: any
  contact_info?: any
  personal_details?: any
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
    const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // Prepare extended data to store in social_links
    const extendedSocialLinks = {
      ...(profileData.social_links || {}),
      // Store extended profile data in the social_links JSON field
      _extended: {
        personal_info: profileData.personal_info || {},
        location_info: profileData.location || {},
        contact_info: profileData.contact_info || {},
        personal_details: profileData.personal_details || {},
      },
    }

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const insertData = {
        id: user.id,
        username: profileData.username || user.email?.split("@")[0] || "",
        full_name: profileData.full_name || "",
        bio: profileData.bio || "",
        avatar_url: profileData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`,
        banner_url: profileData.banner_url || "",
        website: profileData.website || "",
        social_links: extendedSocialLinks,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error: insertError } = await supabase.from("profiles").insert(insertData)

      if (insertError) {
        console.error("Error creating profile:", insertError)
        return { success: false, error: insertError.message }
      }
    } else {
      // Update existing profile - only update fields that exist in the schema
      const updateData: any = {
        updated_at: new Date().toISOString(),
      }

      if (profileData.username !== undefined) updateData.username = profileData.username
      if (profileData.full_name !== undefined) updateData.full_name = profileData.full_name
      if (profileData.bio !== undefined) updateData.bio = profileData.bio
      if (profileData.avatar_url !== undefined) updateData.avatar_url = profileData.avatar_url
      if (profileData.banner_url !== undefined) updateData.banner_url = profileData.banner_url
      if (profileData.website !== undefined) updateData.website = profileData.website

      // Always update social_links with extended data
      updateData.social_links = extendedSocialLinks

      const { error: updateError } = await supabase.from("profiles").update(updateData).eq("id", user.id)

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
    banner_url?: string
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
        banner_url: profileData.banner_url,
        bio: profileData.bio,
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

    // Extract extended data from social_links
    if (data && data.social_links && data.social_links._extended) {
      const extended = data.social_links._extended
      data.personal_info = extended.personal_info || {}
      data.location_info = extended.location_info || {}
      data.contact_info = extended.contact_info || {}
      data.personal_details = extended.personal_details || {}

      // Remove _extended from social_links for clean data
      const { _extended, ...cleanSocialLinks } = data.social_links
      data.social_links = cleanSocialLinks
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
          banner_url: "",
          bio: "",
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

    // Extract extended data from social_links if it exists
    if (data && data.social_links && data.social_links._extended) {
      const extended = data.social_links._extended
      data.personal_info = extended.personal_info || {}
      data.location_info = extended.location_info || {}
      data.contact_info = extended.contact_info || {}
      data.personal_details = extended.personal_details || {}

      // Remove _extended from social_links for clean data
      const { _extended, ...cleanSocialLinks } = data.social_links
      data.social_links = cleanSocialLinks
    } else {
      // Set default empty objects if no extended data exists
      data.personal_info = {}
      data.location_info = {}
      data.contact_info = {}
      data.personal_details = {}
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

    // Extract extended data from social_links
    if (data && data.social_links && data.social_links._extended) {
      const extended = data.social_links._extended
      data.personal_info = extended.personal_info || {}
      data.location_info = extended.location_info || {}
      data.contact_info = extended.contact_info || {}
      data.personal_details = extended.personal_details || {}

      // Remove _extended from social_links for clean data
      const { _extended, ...cleanSocialLinks } = data.social_links
      data.social_links = cleanSocialLinks
    }

    return data
  } catch (error) {
    console.error("Error in getUserProfileByUsername:", error)
    return null
  }
}
