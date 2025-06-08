import * as Sentry from "@sentry/nextjs"

// Initialize Sentry
export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === "development",
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: ["localhost", /^https:\/\/yoursite\.com\/api/],
        }),
      ],
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
  }
}

// CMS-specific error tracking
export class CMSErrorTracker {
  static trackContentError(operation: string, contentId: string, error: Error, context?: Record<string, any>) {
    Sentry.withScope((scope) => {
      scope.setTag("cms.operation", operation)
      scope.setTag("cms.content_id", contentId)
      scope.setContext("cms_context", context || {})
      scope.setLevel("error")
      Sentry.captureException(error)
    })
  }

  static trackMediaError(operation: string, mediaId: string, error: Error, context?: Record<string, any>) {
    Sentry.withScope((scope) => {
      scope.setTag("cms.operation", operation)
      scope.setTag("cms.media_id", mediaId)
      scope.setContext("media_context", context || {})
      scope.setLevel("error")
      Sentry.captureException(error)
    })
  }

  static trackUserAction(action: string, userId: string, metadata?: Record<string, any>) {
    Sentry.addBreadcrumb({
      category: "cms.user_action",
      message: action,
      data: {
        user_id: userId,
        ...metadata,
      },
      level: "info",
    })
  }

  static trackPerformance(operation: string, duration: number, metadata?: Record<string, any>) {
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
  }

  static trackAPIUsage(endpoint: string, method: string, statusCode: number, duration: number) {
    Sentry.addBreadcrumb({
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

// Performance monitoring wrapper
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
