import { type NextRequest, NextResponse } from "next/server"
import payload from "payload"

// Set dynamic rendering for this route
export const dynamic = "force-dynamic"

// Initialize Payload if it hasn't been initialized yet
let initialized = false

const initializePayload = async () => {
  if (!initialized) {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || "a-very-secure-secret-key",
      local: true,
    })
    initialized = true
  }
  return payload
}

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  const payloadInstance = await initializePayload()

  // Handle Payload requests
  const { searchParams } = new URL(request.url)
  const depth = searchParams.get("depth")
  const slug = params.slug?.join("/") || ""

  try {
    // Handle media requests
    if (slug.startsWith("media/")) {
      const mediaPath = slug.replace("media/", "")
      // Use Vercel Blob for media
      // This is a simplified example - you'll need to implement proper media handling
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/${mediaPath}`)
    }

    // Handle API requests
    const doc = await payloadInstance.find({
      collection: slug.split("/")[0],
      depth: depth ? Number.parseInt(depth) : undefined,
    })

    return NextResponse.json(doc)
  } catch (error) {
    console.error(`Error handling GET request for ${slug}:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
  const payloadInstance = await initializePayload()
  const slug = params.slug?.join("/") || ""

  try {
    const body = await request.json()
    const doc = await payloadInstance.create({
      collection: slug.split("/")[0],
      data: body,
    })

    return NextResponse.json(doc)
  } catch (error) {
    console.error(`Error handling POST request for ${slug}:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string[] } }) {
  const payloadInstance = await initializePayload()
  const slug = params.slug?.join("/") || ""
  const [collection, id] = slug.split("/")

  try {
    const body = await request.json()
    const doc = await payloadInstance.update({
      collection,
      id,
      data: body,
    })

    return NextResponse.json(doc)
  } catch (error) {
    console.error(`Error handling PUT request for ${slug}:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string[] } }) {
  const payloadInstance = await initializePayload()
  const slug = params.slug?.join("/") || ""
  const [collection, id] = slug.split("/")

  try {
    const doc = await payloadInstance.delete({
      collection,
      id,
    })

    return NextResponse.json(doc)
  } catch (error) {
    console.error(`Error handling DELETE request for ${slug}:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
