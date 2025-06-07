import { type NextRequest, NextResponse } from "next/server"
import { getPayloadClient } from "@/lib/payload-client"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const pages = await payload.find({
      collection: "pages",
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error("Error fetching pages:", error)
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const data = await request.json()

    const page = await payload.create({
      collection: "pages",
      data,
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error("Error creating page:", error)
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 })
  }
}
