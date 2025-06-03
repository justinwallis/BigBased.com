"use client"

export async function uploadImageClient(
  file: File,
  type: "avatar" | "banner" = "avatar",
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append("avatar", file)

    const endpoint = type === "avatar" ? "/api/upload/avatar" : "/api/upload/banner"
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    })

    const result = await response.json()
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
    const response = await fetch("/api/delete/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error in deleteImageClient:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
