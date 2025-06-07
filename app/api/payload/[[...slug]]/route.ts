import { type NextRequest, NextResponse } from "next/server"
import payload from "payload"

// Set dynamic rendering for this route
export const dynamic = "force-dynamic"

// Initialize Payload if it hasn't been initialized yet
let initialized = false

const initializePayload = async () => {
  if (!initialized) {
    try {
      await payload.init({
        secret: process.env.PAYLOAD_SECRET || "a-very-secure-secret-key",
        local: true,
        express: null,
        db: {
          postgresAdapter: {
            pool: {
              connectionString: process.env.DATABASE_URL,
            },
          },
        },
        onInit: () => {
          console.log("Payload initialized successfully")
        },
      })
      initialized = true
    } catch (error) {
      console.error("Error initializing Payload:", error)
      throw error
    }
  }
  return payload
}

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  try {
    const payloadInstance = await initializePayload()

    // Handle Payload admin requests
    const slug = params.slug?.join("/") || ""

    if (slug === "admin" || slug.startsWith("admin/")) {
      // This is an admin request, let Payload handle it
      return new Response("Admin route", { status: 200 })
    }

    // For API requests, return a simple success message for now
    return NextResponse.json({ success: true, message: "Payload API is working" })
  } catch (error) {
    console.error("Error in GET handler:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}
