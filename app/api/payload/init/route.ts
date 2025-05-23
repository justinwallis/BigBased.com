import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // Add a simple security check
    const { secret } = await req.json()

    if (secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Initializing Payload database...")

    // Dynamic import to avoid build-time issues
    const { getPayload } = await import("@/app/payload/getPayload")

    // Get the Payload instance - this will create tables if they don't exist
    const payload = await getPayload()

    console.log("Payload initialized successfully")

    // Check if admin user exists
    const adminUsers = await payload.find({
      collection: "users",
      where: {
        roles: {
          contains: "admin",
        },
      },
    })

    if (adminUsers.docs.length === 0) {
      console.log("Creating admin user...")

      await payload.create({
        collection: "users",
        data: {
          email: "admin@bigbased.com",
          password: "BigBased2024!",
          name: "Admin",
          roles: ["admin"],
        },
      })

      console.log("Admin user created successfully")
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      adminUsersCount: adminUsers.docs.length,
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
