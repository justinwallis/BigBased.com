import { type NextRequest, NextResponse } from "next/server"
import { getPayloadClient } from "../[...payload]/route"

export async function GET(req: NextRequest) {
  const payload = await getPayloadClient()

  try {
    const html = await payload.admin.getAdminUI()
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Error serving admin UI:", error)
    return NextResponse.json({ error: "Failed to serve admin UI", details: String(error) }, { status: 500 })
  }
}
