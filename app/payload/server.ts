import express from "express"
import payload from "payload"

// Initialize Express
const app = express()
const PORT = process.env.PORT || 3000

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/cms-admin")
})

// Initialize Payload
const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || "a-very-secure-secret-key",
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${process.env.NEXT_PUBLIC_SERVER_URL}/cms-admin`)
    },
  })

  if (process.env.NODE_ENV !== "production") {
    app.listen(PORT)
  }
}

start()

// Export app for Vercel
export default app
