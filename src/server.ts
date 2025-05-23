import express from "express"
import payload from "payload"
import { PostgresAdapter } from "@payloadcms/db-postgres"

const app = express()
const PORT = process.env.PORT || 3000

// Initialize Payload
const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || "",
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
    db: {
      adapter: new PostgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "",
        },
      }),
    },
  })

  // Add your own express routes here
  app.get("/", (req, res) => {
    res.redirect("/admin")
  })

  app.listen(PORT)
}

start()
