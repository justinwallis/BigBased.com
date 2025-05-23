import express from "express"
import payload from "payload"
import next from "next"

const app = express()
const PORT = process.env.PORT || 3000

const start = async (): Promise<void> => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js is building for production`)
    })

    return
  }

  const nextApp = next({
    dev: process.env.NODE_ENV !== "production",
  })

  const nextHandler = nextApp.getRequestHandler()

  app.use((req, res) => nextHandler(req, res))

  await nextApp.prepare()

  app.listen(PORT, async () => {
    payload.logger.info(`Next.js App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`)
  })
}

start()
