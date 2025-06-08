import * as Sentry from "@sentry/nextjs"

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === "development",
  environment: process.env.NODE_ENV,
})

console.log("Sentry initialized on server side with DSN:", SENTRY_DSN)
