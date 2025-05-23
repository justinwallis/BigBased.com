import { type NextRequest, NextResponse } from "next/server"
import payload from "payload"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json()

    if (!secret || secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    if (!payload.initialized) {
      await payload.init({
        secret: process.env.PAYLOAD_SECRET!,
        config: await import("../../../../payload.config").then((m) => m.default),
      })
    }

    // Check if admin user already exists
    const existingUsers = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: "admin@bigbased.com",
        },
      },
    })

    if (existingUsers.docs.length > 0) {
      return NextResponse.json({
        message: "Admin user already exists",
        user: existingUsers.docs[0],
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("BigBased2024!", 12)

    const adminUser = await payload.create({
      collection: "users",
      data: {
        email: "admin@bigbased.com",
        password: hashedPassword,
        roles: ["admin"],
        name: "Admin User",
      },
    })

    return NextResponse.json({
      message: "Admin user created successfully",
      user: adminUser,
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json(
      {
        error: "Failed to create admin user",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
