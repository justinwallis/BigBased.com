// Simple error tracking without Sentry
export function initSentry() {
  console.log("Error tracking initialized (Sentry removed)")
}

// Simple error tracking class
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
