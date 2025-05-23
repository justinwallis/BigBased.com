import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "@/app/payload/getPayload"

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to initialize database",
    usage: "POST with { secret: 'your-payload-secret' }",
  })
}

export async function POST(req: NextRequest) {
  try {
    // Get the secret from the request body
    const body = await req.json()

    // Validate the secret
    if (!body.secret || body.secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    // Initialize Payload
    const payload = await getPayload()

    // Create admin user if it doesn't exist
    const adminEmail = "admin@bigbased.com"
    const existingAdmin = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: adminEmail,
        },
      },
    })

    if (existingAdmin.totalDocs === 0) {
      await payload.create({
        collection: "users",
        data: {
          email: adminEmail,
          password: "BigBased2024!",
          roles: ["admin"],
        },
      })

      console.log("Created admin user:", adminEmail)
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      adminCreated: existingAdmin.totalDocs === 0,
    })
  } catch (error) {
    console.error("Initialization error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
