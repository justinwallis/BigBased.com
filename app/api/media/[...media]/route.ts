import { type NextRequest, NextResponse } from "next/server"
import { get } from "@vercel/blob"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: { media: string[] } }) {
  const mediaPath = params.media.join("/")

  try {
    // Get the blob from Vercel Blob storage
    const blob = await get(mediaPath)

    if (!blob) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    // Redirect to the blob URL
    return NextResponse.redirect(blob.url)
  } catch (error) {
    console.error(`Error retrieving media ${mediaPath}:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
