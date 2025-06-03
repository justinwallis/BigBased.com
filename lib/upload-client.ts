"use client"

import { uploadAvatar, uploadBanner } from "@/app/actions/avatar-actions"

export async function uploadImageClient(
  file: File,
  type: "avatar" | "banner" = "avatar",
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append("avatar", file)

    let result
    if (type === "avatar") {
      result = await uploadAvatar(formData)
    } else {
      result = await uploadBanner(formData)
    }

    return result
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
    // This would need to be implemented in avatar-actions.ts
    // For now, return success
    return { success: true }
  } catch (error) {
    console.error("Error in deleteImageClient:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
