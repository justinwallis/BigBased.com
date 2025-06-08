// Optional instrumentation file for when Sentry is enabled
export async function register() {
  // Only initialize Sentry if explicitly enabled
  if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true" && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      const { initSentry } = await import("./lib/sentry")
      await initSentry()
    } catch (error) {
      console.warn("Failed to initialize Sentry in instrumentation:", error)
    }
  }
}
