import { createNextPayloadServer } from "@payloadcms/next"
import config from "./payload.config"

// Create a Payload server instance
const { middleware } = createNextPayloadServer({
  config,
  // Set this to true if you want to enable local API access
  // This is useful for development but should be disabled in production
  // for security reasons
  apiRoute: "/api/[...payload]",
})

// Export the middleware as the default handler for the API route
export const GET = middleware
export const POST = middleware
export const PUT = middleware
export const PATCH = middleware
export const DELETE = middleware
