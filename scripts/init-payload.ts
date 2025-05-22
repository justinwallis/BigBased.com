import { getPayload } from "../app/payload/getPayload"

async function initializePayload() {
  try {
    console.log("Initializing Payload CMS...")

    const payload = await getPayload()

    // Check if admin user exists
    const adminUsers = await payload.find({
      collection: "users",
      where: {
        role: {
          equals: "admin",
        },
      },
      limit: 1,
    })

    if (adminUsers.docs.length === 0) {
      console.log("Creating admin user...")

      // Create an admin user
      await payload.create({
        collection: "users",
        data: {
          email: "admin@bigbased.com",
          password: "admin123!",
          role: "admin",
          firstName: "Admin",
          lastName: "User",
        },
      })

      console.log("Admin user created successfully!")
      console.log("Email: admin@bigbased.com")
      console.log("Password: admin123!")
      console.log("Please change this password after first login.")
    } else {
      console.log("Admin user already exists.")
    }

    console.log("Payload CMS initialized successfully!")
  } catch (error) {
    console.error("Error initializing Payload:", error)
    process.exit(1)
  }
}

// Run the initialization
initializePayload()
