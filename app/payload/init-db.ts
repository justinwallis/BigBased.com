import { getPayload } from "./getPayload"

// Initialize the database
async function initializeDatabase() {
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

    console.log("Database initialization complete")

    // Exit the process
    process.exit(0)
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

// Run the initialization
initializeDatabase()
