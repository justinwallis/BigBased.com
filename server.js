const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const express = require("express")
const payload = require("payload")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = process.env.PORT || 3000
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  const server = express()

  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || "a-very-secure-secret-key",
    express: server,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${process.env.NEXT_PUBLIC_SERVER_URL}/cms-admin`)
    },
  })

  // Handle all other routes with Next.js
  server.all("*", (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
