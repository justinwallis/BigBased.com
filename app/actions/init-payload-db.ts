"use server"

import { getPayload } from "@/app/payload/getPayload"

export async function initPayloadDb() {
  try {
    // Initialize Payload
    const payload = await getPayload()

    // Create an admin user if one doesn't exist
    const adminExists = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: "admin@bigbased.com",
        },
      },
    })

    if (adminExists.totalDocs === 0) {
      await payload.create({
        collection: "users",
        data: {
          email: "admin@bigbased.com",
          password: "BigBased2024!",
          name: "Admin User",
          roles: ["admin"],
        },
      })
    }

    return {
      success: true,
      message:
        "Database initialized successfully. Default admin user created with email: admin@bigbased.com and password: BigBased2024!",
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
