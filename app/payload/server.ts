import express from "express"
import payload from "payload"
import config from "./payload.config"

// Create an Express app
const app = express()

// Initialize Payload
const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || "your-payload-secret",
    express: app,
    config,
  })

  // Add your own express middleware here

  // Start the server
  app.listen(3000, () => {
    console.log("Payload Admin URL:", payload.getAdminURL())
  })
}

start()
