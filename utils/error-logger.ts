// Types for error logging
interface ErrorLogEntry {
  message: string
  stack?: string
  timestamp: string
  metadata: Record<string, any>
}

interface ErrorLoggerOptions {
  maxLogSize?: number
  shouldSendToServer?: boolean
  serverEndpoint?: string
}

class ErrorLogger {
  private logs: ErrorLogEntry[] = []
  private options: ErrorLoggerOptions = {
    maxLogSize: 100,
    shouldSendToServer: false,
    serverEndpoint: "/api/error-logs",
  }

  constructor(options?: ErrorLoggerOptions) {
    if (options) {
      this.options = { ...this.options, ...options }
    }

    // Initialize error listeners
    if (typeof window !== "undefined") {
      this.setupGlobalErrorListeners()
    }
  }

  private setupGlobalErrorListeners() {
    // Capture unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.logError(event.reason, {
        type: "unhandledRejection",
        source: "window.onunhandledrejection",
      })
    })

    // Capture global errors
    window.addEventListener("error", (event) => {
      this.logError(event.error || new Error(event.message), {
        type: "globalError",
        source: "window.onerror",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })
  }

  public logError(error: Error | string, metadata: Record<string, any> = {}) {
    const errorMessage = typeof error === "string" ? error : error.message
    const errorStack = typeof error === "string" ? undefined : error.stack

    const logEntry: ErrorLogEntry = {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
      metadata: {
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "server",
        url: typeof window !== "undefined" ? window.location.href : "",
        ...metadata,
      },
    }

    // Add to in-memory logs
    this.logs.push(logEntry)

    // Trim logs if they exceed max size
    if (this.logs.length > this.options.maxLogSize!) {
      this.logs = this.logs.slice(-this.options.maxLogSize!)
    }

    // Log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error logged:", logEntry)
    }

    // Send to server if enabled
    if (this.options.shouldSendToServer) {
      this.sendToServer(logEntry)
    }

    return logEntry
  }

  private async sendToServer(logEntry: ErrorLogEntry) {
    try {
      // In a real app, this would send the error to your backend
      const response = await fetch(this.options.serverEndpoint!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logEntry),
      })

      if (!response.ok) {
        console.error("Failed to send error log to server:", await response.text())
      }
    } catch (err) {
      console.error("Error sending log to server:", err)
    }
  }

  public getLogs() {
    return [...this.logs]
  }

  public clearLogs() {
    this.logs = []
  }
}

// Create and export a singleton instance
export const errorLogger = new ErrorLogger({
  shouldSendToServer: false, // Set to true to enable sending to server
})

// Utility function to format errors for display
export function formatErrorForDisplay(error: Error | string): string {
  if (typeof error === "string") return error
  return `${error.name}: ${error.message}`
}

// Simple logging functions without any external dependencies
export const logError = (error: any, errorInfo: any = {}) => {
  console.error("Logging error:", error, errorInfo)
  errorLogger.logError(error, errorInfo)
}

export const logMessage = (message: string, extraInfo: any = {}) => {
  console.log("Logging message:", message, extraInfo)
}
