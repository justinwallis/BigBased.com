interface PerformanceMetric {
  name: string
  startTime: number
  duration?: number
  metadata?: Record<string, any>
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private marks: Record<string, number> = {}
  private enabled = true

  constructor() {
    // Initialize performance monitoring
    if (typeof window !== "undefined") {
      this.setupPerformanceObserver()
    }
  }

  private setupPerformanceObserver() {
    try {
      // Use the Performance Observer API if available
      if (typeof PerformanceObserver === "function") {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.recordPerformanceEntry(entry)
          })
        })

        // Observe various performance entry types
        observer.observe({ entryTypes: ["resource", "navigation", "paint", "largest-contentful-paint"] })
      }

      // Record initial page load metrics
      window.addEventListener("load", () => {
        if (performance.timing) {
          const timing = performance.timing
          this.recordMetric("page-load", timing.loadEventEnd - timing.navigationStart, {
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            firstPaint: timing.responseEnd - timing.navigationStart,
            networkLatency: timing.responseEnd - timing.requestStart,
          })
        }
      })
    } catch (error) {
      console.error("Error setting up performance observer:", error)
    }
  }

  private recordPerformanceEntry(entry: PerformanceEntry) {
    if (!this.enabled) return

    // Record different types of performance entries
    switch (entry.entryType) {
      case "resource":
        const resourceEntry = entry as PerformanceResourceTiming
        this.recordMetric(`resource-${resourceEntry.name}`, resourceEntry.duration, {
          initiatorType: resourceEntry.initiatorType,
          size: resourceEntry.transferSize,
          startTime: resourceEntry.startTime,
        })
        break

      case "paint":
        const paintEntry = entry as PerformancePaintTiming
        this.recordMetric(`paint-${paintEntry.name}`, 0, {
          startTime: paintEntry.startTime,
        })
        break

      case "largest-contentful-paint":
        const lcpEntry = entry as any // LCP is not in standard TS types yet
        this.recordMetric("largest-contentful-paint", 0, {
          startTime: lcpEntry.startTime,
          size: lcpEntry.size,
          element: lcpEntry.element ? lcpEntry.element.tagName : "unknown",
        })
        break
    }
  }

  /**
   * Start timing a metric
   */
  public startMark(name: string): void {
    if (!this.enabled) return
    this.marks[name] = performance.now()
  }

  /**
   * End timing a metric and record the duration
   */
  public endMark(name: string, metadata?: Record<string, any>): number | undefined {
    if (!this.enabled || !(name in this.marks)) return

    const startTime = this.marks[name]
    const endTime = performance.now()
    const duration = endTime - startTime

    this.recordMetric(name, duration, metadata)
    delete this.marks[name]

    return duration
  }

  /**
   * Record a performance metric
   */
  public recordMetric(name: string, duration: number, metadata?: Record<string, any>): void {
    if (!this.enabled) return

    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      duration,
      metadata,
    }

    this.metrics.push(metric)

    // Log in development
    if (process.env.NODE_ENV !== "production") {
      console.debug(`Performance: ${name} - ${duration.toFixed(2)}ms`, metadata)
    }

    // In a real app, you might want to send this to your analytics service
    this.sendMetricToAnalytics(metric)
  }

  /**
   * Send a metric to an analytics service
   */
  private sendMetricToAnalytics(metric: PerformanceMetric): void {
    // This is a placeholder for sending metrics to an analytics service
    // In a real app, you would implement this to send data to your analytics provider
    // Example:
    // if (window.gtag) {
    //   window.gtag('event', 'performance', {
    //     event_category: 'performance',
    //     event_label: metric.name,
    //     value: Math.round(metric.duration || 0),
    //     ...metric.metadata
    //   });
    // }
  }

  /**
   * Get all recorded metrics
   */
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * Clear all recorded metrics
   */
  public clearMetrics(): void {
    this.metrics = []
  }

  /**
   * Enable or disable performance monitoring
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Get a summary of performance metrics
   */
  public getSummary(): Record<string, any> {
    const summary: Record<string, any> = {
      totalMetrics: this.metrics.length,
      averageDurations: {},
      maxDurations: {},
    }

    // Group metrics by name
    const metricsByName: Record<string, PerformanceMetric[]> = {}
    this.metrics.forEach((metric) => {
      if (!metricsByName[metric.name]) {
        metricsByName[metric.name] = []
      }
      metricsByName[metric.name].push(metric)
    })

    // Calculate averages and maximums
    Object.entries(metricsByName).forEach(([name, metrics]) => {
      const durations = metrics.map((m) => m.duration).filter((d): d is number => d !== undefined)

      if (durations.length > 0) {
        const sum = durations.reduce((a, b) => a + b, 0)
        summary.averageDurations[name] = sum / durations.length
        summary.maxDurations[name] = Math.max(...durations)
      }
    })

    return summary
  }
}

// Create and export a singleton instance
export const performanceMonitor = new PerformanceMonitor()
