import { createClient } from "@/lib/supabase/client"

export async function uploadImageClient(
  file: File,
  type: "avatar" | "banner" = "avatar",
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const maxSize = type === "banner" ? 10 * 1024 * 1024 : 5 * 1024 * 1024 // 10MB for banner, 5MB for avatar

    if (file.size > maxSize) {
      const maxSizeMB = type === "banner" ? "10MB" : "5MB"
      return { success: false, error: `File size exceeds the ${maxSizeMB} limit` }
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images." }
    }

    // Upload file
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage.from("avatars").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading image:", error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName)

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error("Error in uploadImageClient:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function deleteImageClient(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Extract file path from URL
    const urlParts = imageUrl.split("/")
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `${user.id}/${fileName}`

    // Delete from storage
    const { error: deleteError } = await supabase.storage.from("avatars").remove([filePath])

    if (deleteError) {
      console.error("Error deleting image:", deleteError)
      return { success: false, error: deleteError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteImageClient:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
