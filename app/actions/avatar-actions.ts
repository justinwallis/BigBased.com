"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function uploadAvatar(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const file = formData.get("avatar") as File
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image." }
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File too large. Please upload an image smaller than 5MB." }
    }

    // Create unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from("avatars").upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("Storage upload error:", error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName)

    console.log("Avatar uploaded successfully:", publicUrl)
    return { success: true, url: publicUrl }
  } catch (error) {
    console.error("Error in uploadAvatar:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error uploading avatar",
    }
  }
}

export async function deleteAvatar(avatarUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Extract file path from URL
    const urlParts = avatarUrl.split("/avatars/")
    if (urlParts.length !== 2) {
      return { success: false, error: "Invalid avatar URL" }
    }

    const filePath = urlParts[1]

    // Delete file from storage
    const { error } = await supabase.storage.from("avatars").remove([filePath])

    if (error) {
      console.error("Storage delete error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteAvatar:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error deleting avatar",
    }
  }
}
