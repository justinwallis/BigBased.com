import {
  uploadAvatar as uploadAvatarAction,
  uploadBanner as uploadBannerAction,
  deleteAvatar as deleteAvatarAction,
  deleteBanner as deleteBannerAction,
} from "@/app/actions/avatar-actions"

export async function uploadAvatar(file: File) {
  try {
    const formData = new FormData()
    formData.append("avatar", file)

    const result = await uploadAvatarAction(formData)
    return result
  } catch (error) {
    console.error("Upload error:", error)
    return { success: false, error: "Upload failed" }
  }
}

export async function uploadBanner(file: File) {
  try {
    const formData = new FormData()
    formData.append("banner", file)

    const result = await uploadBannerAction(formData)
    return result
  } catch (error) {
    console.error("Banner upload error:", error)
    return { success: false, error: "Upload failed" }
  }
}

export async function deleteAvatar() {
  try {
    const result = await deleteAvatarAction()
    return result
  } catch (error) {
    console.error("Delete error:", error)
    return { success: false, error: "Delete failed" }
  }
}

export async function deleteBanner() {
  try {
    const result = await deleteBannerAction()
    return result
  } catch (error) {
    console.error("Delete error:", error)
    return { success: false, error: "Delete failed" }
  }
}

// Legacy exports for compatibility
export async function uploadImageClient(
  file: File,
  type: "avatar" | "banner" = "avatar",
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (type === "avatar") {
    return uploadAvatar(file)
  } else {
    return uploadBanner(file)
  }
}

export async function deleteImageClient(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    // For now, just call deleteAvatar - you can extend this for banners
    const result = await deleteAvatar()
    return result
  } catch (error) {
    console.error("Delete error:", error)
    return { success: false, error: "Delete failed" }
  }
}
