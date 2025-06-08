interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  metadata?: Record<string, any>
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private maxMetrics = 1000

  constructor() {
    if (typeof window !== "undefined") {
      this.setupPerformanceObserver()
    }
  }

  private setupPerformanceObserver() {
    try {
      // Observe Core Web Vitals
      if ("PerformanceObserver" in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric(entry.name, entry.value || 0, {
              entryType: entry.entryType,
              startTime: entry.startTime,
            })
          }
        })

        observer.observe({ entryTypes: ["measure", "navigation", "paint"] })
      }
    } catch (error) {
      console.warn("Performance observer setup failed:", error)
    }
  }

  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata,
    }

    this.metrics.push(metric)

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Performance metric: ${name} = ${value}`, metadata)
    }
  }

  getMetrics() {
    return [...this.metrics]
  }

  getMetricsByName(name: string) {
    return this.metrics.filter((metric) => metric.name === name)
  }

  clearMetrics() {
    this.metrics = []
  }

  // Core Web Vitals helpers
  recordCLS(value: number) {
    this.recordMetric("CLS", value, { type: "core-web-vital" })
  }

  recordFID(value: number) {
    this.recordMetric("FID", value, { type: "core-web-vital" })
  }

  recordLCP(value: number) {
    this.recordMetric("LCP", value, { type: "core-web-vital" })
  }

  recordTTFB(value: number) {
    this.recordMetric("TTFB", value, { type: "core-web-vital" })
  }

  recordFCP(value: number) {
    this.recordMetric("FCP", value, { type: "core-web-vital" })
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Helper function to measure function execution time
export function measureExecutionTime<T>(name: string, fn: () => T | Promise<T>): T | Promise<T> {
  const start = performance.now()

  try {
    const result = fn()

    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start
        performanceMonitor.recordMetric(name, duration, { type: "execution-time" })
      })
    } else {
      const duration = performance.now() - start
      performanceMonitor.recordMetric(name, duration, { type: "execution-time" })
      return result
    }
  } catch (error) {
    const duration = performance.now() - start
    performanceMonitor.recordMetric(name, duration, {
      type: "execution-time",
      error: true,
    })
    throw error
  }
}
