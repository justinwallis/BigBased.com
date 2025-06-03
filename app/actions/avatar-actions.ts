"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadAvatar(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const file = formData.get("avatar") as File
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage.from("avatars").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName)

    // Update user profile
    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    revalidatePath("/profile")
    return { success: true, url: publicUrl }
  } catch (error) {
    console.error("Avatar upload error:", error)
    return { success: false, error: "Upload failed" }
  }
}

export async function uploadBanner(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Try both possible field names for the banner file
    const file = (formData.get("banner") || formData.get("avatar")) as File
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Validate file size (10MB for banners)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return { success: false, error: "File size exceeds 10MB limit" }
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type. Please use JPEG, PNG, GIF, or WebP" }
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/banner-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage.from("avatars").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Supabase upload error:", error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName)

    // Update user profile
    const { error: updateError } = await supabase.from("profiles").update({ banner_url: publicUrl }).eq("id", user.id)

    if (updateError) {
      console.error("Profile update error:", updateError)
      return { success: false, error: updateError.message }
    }

    revalidatePath("/profile")
    revalidatePath("/[username]", "page")
    return { success: true, url: publicUrl }
  } catch (error) {
    console.error("Banner upload error:", error)
    return { success: false, error: "Upload failed" }
  }
}

export async function deleteAvatar() {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Update user profile to remove avatar
    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Avatar delete error:", error)
    return { success: false, error: "Delete failed" }
  }
}

export async function deleteBanner() {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Update user profile to remove banner
    const { error: updateError } = await supabase.from("profiles").update({ banner_url: null }).eq("id", user.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    revalidatePath("/profile")
    revalidatePath("/[username]", "page")
    return { success: true }
  } catch (error) {
    console.error("Banner delete error:", error)
    return { success: false, error: "Delete failed" }
  }
}
