import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In production, this would serve the bundled Payload admin UI
    // For development, we'll redirect to the Payload admin URL
    return NextResponse.redirect("/admin")
  } catch (error) {
    console.error("Error serving Payload admin:", error)
    return NextResponse.json({ error: "Failed to serve Payload admin" }, { status: 500 })
  }
}
