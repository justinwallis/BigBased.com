import { NextResponse } from "next/server"
import { getPayload } from "@/app/payload/getPayload"

export async function GET() {
  try {
    // Try to get Payload instance
    const payload = await getPayload()

    // Try a simple database query
    const users = await payload.find({
      collection: "users",
      limit: 1,
    })

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      usersCount: users.totalDocs,
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
