"use server"

import { getSupabaseServer } from "@/lib/supabase/server"

export async function createUserProfile(userId: string, username: string) {
  const supabase = getSupabaseServer()

  // Generate avatar URL using the username
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`

  const { error } = await supabase.from("profiles").insert({
    id: userId,
    username,
    avatar_url: avatarUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error creating profile:", error)
    throw new Error("Failed to create user profile")
  }

  return { success: true }
}

export async function getUserProfile(userId: string) {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(
  userId: string,
  profileData: Partial<{
    username: string
    full_name: string
    avatar_url: string
    website: string
    bio: string
  }>,
) {
  const supabase = getSupabaseServer()

  const { error } = await supabase
    .from("profiles")
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error("Error updating profile:", error)
    throw new Error("Failed to update user profile")
  }

  return { success: true }
}
