// Simple error tracking without external dependencies
// This file maintains compatibility with existing imports

// Initialize function (no-op without Sentry)
export function initSentry() {
  console.log("Error tracking initialized (Sentry removed)")
}

// Simple error tracking functions
export function trackError(error: Error | string, context?: Record<string, any>) {
  console.error("Error tracked:", error, context)
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  console.log("Event tracked:", eventName, properties)
}

export function setUserContext(user: { id: string; email?: string; username?: string }) {
  console.log("User context set:", user)
}

export function addBreadcrumb(message: string, category?: string, level?: string) {
  console.log("Breadcrumb:", { message, category, level })
}

// No-op functions to maintain compatibility
export const init = () => {}
export const captureException = (error: any) => console.error("Exception:", error)
export const captureMessage = (message: string) => console.log("Message:", message)

// CMS Error Tracker class - replaced Sentry with console logging
export class CMSErrorTracker {
  static trackContentError(operation: string, contentId: string, error: Error, context?: Record<string, any>) {
    console.error(`CMS Content Error [${operation}] for ${contentId}:`, error, context)
  }

  static trackMediaError(operation: string, mediaId: string, error: Error, context?: Record<string, any>) {
    console.error(`CMS Media Error [${operation}] for ${mediaId}:`, error, context)
  }

  static trackUserAction(action: string, userId: string, metadata?: Record<string, any>) {
    console.log(`User Action [${action}] by ${userId}:`, metadata)
  }

  static trackPerformance(operation: string, duration: number, metadata?: Record<string, any>) {
    if (duration > 5000) {
      console.warn(`Slow operation: ${operation} took ${duration}ms`, metadata)
    } else {
      console.log(`Performance: ${operation} took ${duration}ms`, metadata)
    }
  }

  static trackAPIUsage(endpoint: string, method: string, statusCode: number, duration: number) {
    const level = statusCode >= 400 ? "error" : "info"
    console[level](`API ${method} ${endpoint} - ${statusCode} (${duration}ms)`)
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
