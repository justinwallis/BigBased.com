import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function uploadAvatar(
  formData: FormData,
  type: "avatar" | "banner" = "avatar",
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const file = formData.get("avatar") as File | null

    if (!file) {
      return { success: false, error: "No file selected" }
    }

    const maxSize = type === "banner" ? 10 * 1024 * 1024 : 5 * 1024 * 1024 // 10MB for banner, 5MB for avatar

    if (file.size > maxSize) {
      return { success: false, error: "File size exceeds the limit" }
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type" }
    }

    // Upload file
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage.from("avatars").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading avatar:", error)
      return { success: false, error: error.message }
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${data.path}`

    return { success: true, url }
  } catch (error) {
    console.error("Error in uploadAvatar:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function uploadBanner(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  return uploadAvatar(formData, "banner")
}

export async function deleteAvatar(avatarUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Extract file path from URL
    const urlParts = avatarUrl.split("/")
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `${user.id}/${fileName}`

    // Delete from storage
    const { error: deleteError } = await supabase.storage.from("avatars").remove([filePath])

    if (deleteError) {
      console.error("Error deleting avatar:", deleteError)
      return { success: false, error: deleteError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteAvatar:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function deleteBanner(bannerUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Extract file path from URL
    const urlParts = bannerUrl.split("/")
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `${user.id}/${fileName}`

    // Delete from storage
    const { error: deleteError } = await supabase.storage.from("avatars").remove([filePath])

    if (deleteError) {
      console.error("Error deleting banner:", deleteError)
      return { success: false, error: deleteError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteBanner:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
