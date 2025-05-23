import { createNextRoute } from "@payloadcms/next"
import config from "./payload.config"

export const { GET, POST, PUT, PATCH, DELETE } = createNextRoute({
  config,
})
