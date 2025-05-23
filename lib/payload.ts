import payload from "payload"
import { Sequelize } from "sequelize"
import config from "../payload.config"

// Initialize Payload
let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  }
}

export const getPayloadClient = async () => {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = initPayload()
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}

async function initPayload() {
  // Test database connection
  const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
  if (!dbUrl) {
    throw new Error("DATABASE_URL is required")
  }

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
  const payloadClient = await payload.init({
    secret: process.env.PAYLOAD_SECRET || "your-secret-key-change-in-production",
    config,
  })

  return payloadClient
}
