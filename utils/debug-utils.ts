interface DebugInfo {
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  message: string
  data?: any
}

class DebugLogger {
  private logs: DebugInfo[] = []
  private maxLogs = 500
  private isEnabled = process.env.NODE_ENV === "development"

  log(level: DebugInfo["level"], message: string, data?: any) {
    if (!this.isEnabled) return

    const debugInfo: DebugInfo = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }

    this.logs.push(debugInfo)

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output
    const consoleMethod = console[level] || console.log
    consoleMethod(`[${level.toUpperCase()}] ${message}`, data || "")
  }

  info(message: string, data?: any) {
    this.log("info", message, data)
  }

  warn(message: string, data?: any) {
    this.log("warn", message, data)
  }

  error(message: string, data?: any) {
    this.log("error", message, data)
  }

  debug(message: string, data?: any) {
    this.log("debug", message, data)
  }

  getLogs() {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }

  enable() {
    this.isEnabled = true
  }

  disable() {
    this.isEnabled = false
  }
}

export const debugLogger = new DebugLogger()

// Helper functions for common debug scenarios
export function debugApiCall(url: string, method: string, data?: any) {
  debugLogger.debug(`API Call: ${method} ${url}`, data)
}

export function debugComponentRender(componentName: string, props?: any) {
  debugLogger.debug(`Component Render: ${componentName}`, props)
}

export function debugStateChange(stateName: string, oldValue: any, newValue: any) {
  debugLogger.debug(`State Change: ${stateName}`, { oldValue, newValue })
}

export function debugPerformance(operation: string, duration: number) {
  debugLogger.debug(`Performance: ${operation} took ${duration}ms`)
}

// Environment info helper
export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "server",
    url: typeof window !== "undefined" ? window.location.href : "server",
    timestamp: new Date().toISOString(),
  }
}
