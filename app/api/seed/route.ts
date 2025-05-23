import { NextResponse } from "next/server"
import { getPayloadClient } from "../[...payload]/route"

export async function GET() {
  try {
    const payload = await getPayloadClient()

    // Check if admin user exists
    const { docs: existingUsers } = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: "admin@bigbased.com",
        },
      },
    })

    if (existingUsers.length === 0) {
      // Create admin user
      await payload.create({
        collection: "users",
        data: {
          email: "admin@bigbased.com",
          password: "BigBased2024!",
          roles: ["admin"],
        },
      })
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database", details: String(error) }, { status: 500 })
  }
}
