"use server"

import { cookies } from "next/headers"
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"

type ProfileData = {
  id: string
  username?: string
  full_name?: string
  avatar_url?: string
  website?: string
  bio?: string
  email?: string
}

// Create a Supabase client for server components
function createServerClient() {
  const cookieStore = cookies()

  return createSupabaseServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
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
  username: string
  email: string
  full_name?: string
  avatar_url?: string
}) {
  const supabase = createServerClient()

  // Generate avatar URL if not provided
  const avatarUrl = profileData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profileData.username}`

  const { error } = await supabase.from("profiles").insert({
    id: profileData.id,
    username: profileData.username,
    full_name: profileData.full_name,
    avatar_url: avatarUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error creating profile:", error)
    throw new Error(error.message)
  }

  return { success: true }
}

export async function getUserProfile(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, profileData: Partial<ProfileData>) {
  const supabase = createServerClient()

  const { error } = await supabase
    .from("profiles")
    .update({
      username: profileData.username,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url,
      website: profileData.website,
      bio: profileData.bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error("Error updating profile:", error)
    throw new Error(error.message)
  }

  return { success: true }
}
