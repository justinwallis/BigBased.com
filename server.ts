import express from "express"
import payload from "payload"
import { Sequelize } from "sequelize"
import { nextApp, nextHandler } from "./next-utils"

const app = express()
const PORT = process.env.PORT || 3000

// Initialize Payload
const start = async () => {
  // Initialize database connection
  const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
  if (!dbUrl) {
    throw new Error("DATABASE_URL is required")
  }

  // Test database connection
  const sequelize = new Sequelize(dbUrl, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  })

  try {
    await sequelize.authenticate()
    console.log("Database connection has been established successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
    throw error
  }

  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || "your-secret-key-change-in-production",
    express: app,
    onInit: () => {
      console.log(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  // Use Next.js handler for all other routes
  app.use((req, res) => nextHandler(req, res))

  if (process.env.VERCEL) {
    // If on Vercel, we don't need to listen on a port
    console.log("Running on Vercel")
  } else {
    nextApp.prepare().then(() => {
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
      })
    })
  }
}

start()
