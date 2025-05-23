"use server"

import { getPayload } from "../payload/getPayload"

export async function initializePayloadDatabase() {
  try {
    console.log("Initializing Payload database...")

    // Get the Payload instance
    const payload = await getPayload()

    console.log("Payload initialized successfully")

    // Create an admin user if none exists
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

    // Check if Pages collection has any documents
    const pages = await payload.find({
      collection: "pages",
      limit: 1,
    })

    if (pages.docs.length === 0) {
      console.log("Creating sample page...")

      await payload.create({
        collection: "pages",
        data: {
          title: "Welcome to Big Based",
          slug: "welcome",
          content: [
            {
              children: [
                {
                  text: "Welcome to Big Based! This is your first page created with Payload CMS.",
                },
              ],
            },
          ],
          status: "published",
        },
      })

      console.log("Sample page created successfully")
    }

    return {
      success: true,
      message: "Payload database initialized successfully",
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
