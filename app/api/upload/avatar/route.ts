import { NextResponse } from "next/server"
import { uploadAvatar } from "@/app/actions/avatar-actions"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const result = await uploadAvatar(formData)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in avatar upload API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
