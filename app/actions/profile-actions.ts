"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

// Create a Supabase client for server-side operations
function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
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

    return { success: true }
  } catch (error) {
    console.error("Error in createProfile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error creating profile",
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
