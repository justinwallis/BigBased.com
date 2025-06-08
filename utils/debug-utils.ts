/**
 * Debug utility functions for troubleshooting rendering and loading issues
 */

// Enable or disable debug mode
const DEBUG_MODE = process.env.NODE_ENV === "development"

/**
 * Log a debug message to the console if debug mode is enabled
 */
export function debugLog(message: string, data?: any): void {
  if (!DEBUG_MODE) return

  if (data) {
    console.log(`[DEBUG] ${message}`, data)
  } else {
    console.log(`[DEBUG] ${message}`)
  }
}

/**
 * Log a component lifecycle event
 */
export function logComponentLifecycle(componentName: string, event: string, data?: any): void {
  if (!DEBUG_MODE) return

  debugLog(`${componentName} - ${event}`, data)
}

/**
 * Create a component render tracker
 * Usage: const tracker = createRenderTracker('MyComponent')
 * Then call tracker() in your component to log renders
 */
export function createRenderTracker(componentName: string) {
  let renderCount = 0

  return (props?: any) => {
    renderCount++
    debugLog(`${componentName} rendered (${renderCount})`, props)
  }
}

/**
 * Log DOM structure for debugging layout issues
 */
export function logDOMStructure(selector = "body"): void {
  if (!DEBUG_MODE || typeof document === "undefined") return

  const element = document.querySelector(selector)
  if (!element) {
    debugLog(`Element not found: ${selector}`)
    return
  }

  const structure = getDOMStructure(element)
  debugLog(`DOM Structure for ${selector}:`, structure)
}

/**
 * Helper function to get DOM structure
 */
function getDOMStructure(element: Element, depth = 0, maxDepth = 3): any {
  if (depth > maxDepth) return "..."

  const children = Array.from(element.children).map((child) => getDOMStructure(child, depth + 1, maxDepth))

  return {
    tag: element.tagName.toLowerCase(),
    id: element.id || undefined,
    classes: element.className ? element.className.split(" ").filter(Boolean) : undefined,
    children: children.length ? children : undefined,
  }
}
