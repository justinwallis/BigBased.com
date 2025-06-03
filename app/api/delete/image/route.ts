import { NextResponse } from "next/server"
import { deleteAvatar, deleteBanner } from "@/app/actions/avatar-actions"

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: "No image URL provided" }, { status: 400 })
    }

    // Determine if it's an avatar or banner based on the URL
    const isBanner = imageUrl.includes("banner-")

    const result = isBanner ? await deleteBanner(imageUrl) : await deleteAvatar(imageUrl)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in delete image API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
