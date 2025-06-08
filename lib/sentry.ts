// Conditional Sentry integration with toggle capability
let sentryInitialized = false

// Check if Sentry should be enabled
function isSentryEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true" && !!process.env.NEXT_PUBLIC_SENTRY_DSN
}

// Safe Sentry initialization
export async function initSentry() {
  if (!isSentryEnabled() || sentryInitialized) {
    return
  }

  try {
    const Sentry = await import("@sentry/nextjs")

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === "development",
      beforeSend(event, hint) {
        // Filter out known non-critical errors
        if (event.exception) {
          const error = hint.originalException
          if (error instanceof Error) {
            // Skip network errors that are user-related
            if (error.message.includes("NetworkError") || error.message.includes("fetch")) {
              return null
            }
          }
        }
        return event
      },
    })

    sentryInitialized = true
    console.log("Sentry initialized successfully")
  } catch (error) {
    console.warn("Failed to initialize Sentry:", error)
  }
}

// Safe Sentry operations
export const SafeSentry = {
  captureException: async (error: Error, context?: Record<string, any>) => {
    if (!isSentryEnabled()) return null

    try {
      const Sentry = await import("@sentry/nextjs")
      return Sentry.captureException(error, context)
    } catch (e) {
      console.warn("Failed to capture exception:", e)
      return null
    }
  },

  captureMessage: async (message: string, level: "info" | "warning" | "error" = "info") => {
    if (!isSentryEnabled()) return null

    try {
      const Sentry = await import("@sentry/nextjs")
      return Sentry.captureMessage(message, { level })
    } catch (e) {
      console.warn("Failed to capture message:", e)
      return null
    }
  },

  addBreadcrumb: async (breadcrumb: any) => {
    if (!isSentryEnabled()) return

    try {
      const Sentry = await import("@sentry/nextjs")
      Sentry.addBreadcrumb(breadcrumb)
    } catch (e) {
      console.warn("Failed to add breadcrumb:", e)
    }
  },
}

// CMS-specific error tracking with safe operations
export class CMSErrorTracker {
  static async trackContentError(operation: string, contentId: string, error: Error, context?: Record<string, any>) {
    if (!isSentryEnabled()) return

    try {
      const Sentry = await import("@sentry/nextjs")
      Sentry.withScope((scope) => {
        scope.setTag("cms.operation", operation)
        scope.setTag("cms.content_id", contentId)
        scope.setContext("cms_context", context || {})
        scope.setLevel("error")
        Sentry.captureException(error)
      })
    } catch (e) {
      console.warn("Failed to track content error:", e)
    }
  }

  static async trackMediaError(operation: string, mediaId: string, error: Error, context?: Record<string, any>) {
    if (!isSentryEnabled()) return

    try {
      const Sentry = await import("@sentry/nextjs")
      Sentry.withScope((scope) => {
        scope.setTag("cms.operation", operation)
        scope.setTag("cms.media_id", mediaId)
        scope.setContext("media_context", context || {})
        scope.setLevel("error")
        Sentry.captureException(error)
      })
    } catch (e) {
      console.warn("Failed to track media error:", e)
    }
  }

  static async trackUserAction(action: string, userId: string, metadata?: Record<string, any>) {
    SafeSentry.addBreadcrumb({
      category: "cms.user_action",
      message: action,
      data: {
        user_id: userId,
        ...metadata,
      },
      level: "info",
    })
  }

  static async trackPerformance(operation: string, duration: number, metadata?: Record<string, any>) {
    if (!isSentryEnabled()) return

    try {
      const Sentry = await import("@sentry/nextjs")
      Sentry.withScope((scope) => {
        scope.setTag("cms.performance", operation)
        scope.setContext("performance_context", {
          duration_ms: duration,
          ...metadata,
        })

        if (duration > 5000) {
          scope.setLevel("warning")
          Sentry.captureMessage(`Slow CMS operation: ${operation} took ${duration}ms`)
        }
      })
    } catch (e) {
      console.warn("Failed to track performance:", e)
    }
  }

  static async trackAPIUsage(endpoint: string, method: string, statusCode: number, duration: number) {
    SafeSentry.addBreadcrumb({
      category: "cms.api",
      message: `${method} ${endpoint}`,
      data: {
        status_code: statusCode,
        duration_ms: duration,
      },
      level: statusCode >= 400 ? "error" : "info",
    })
  }
}

// Performance monitoring wrapper with safe operations
export function withPerformanceTracking<T extends (...args: any[]) => Promise<any>>(operation: string, fn: T): T {
  return (async (...args: Parameters<T>) => {
    const startTime = Date.now()
    try {
      const result = await fn(...args)
      const duration = Date.now() - startTime
      CMSErrorTracker.trackPerformance(operation, duration)
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      CMSErrorTracker.trackPerformance(operation, duration, { error: true })
      throw error
    }
  }) as T
}

export { isSentryEnabled }
