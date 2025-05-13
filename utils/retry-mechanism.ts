/**
 * Utility for retrying failed operations with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  {
    maxRetries = 3,
    initialDelay = 300,
    maxDelay = 5000,
    factor = 2,
    jitter = true,
    onRetry = (attempt: number, delay: number, error: Error) => {},
  }: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    factor?: number
    jitter?: boolean
    onRetry?: (attempt: number, delay: number, error: Error) => void
  } = {},
): Promise<T> {
  let attempt = 0
  let delay = initialDelay

  while (true) {
    try {
      return await operation()
    } catch (error) {
      attempt++

      if (attempt >= maxRetries) {
        throw error
      }

      // Calculate next delay with exponential backoff
      delay = Math.min(delay * factor, maxDelay)

      // Add jitter to prevent synchronized retries
      if (jitter) {
        delay = delay * (0.5 + Math.random() * 0.5)
      }

      // Call the onRetry callback
      onRetry(attempt, delay, error instanceof Error ? error : new Error(String(error)))

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

/**
 * Utility for retrying resource loading
 */
export async function retryResourceLoad(
  resourceId: string,
  loadFn: () => Promise<any>,
  loadingManager: any,
  options = {},
): Promise<any> {
  try {
    loadingManager.registerResource(resourceId, 1)
    loadingManager.startLoading(resourceId)

    const result = await retryWithBackoff(loadFn, {
      maxRetries: 3,
      onRetry: (attempt, delay, error) => {
        console.warn(`Retrying ${resourceId} (attempt ${attempt}) after ${delay}ms due to:`, error.message)
      },
      ...options,
    })

    loadingManager.resourceLoaded(resourceId)
    return result
  } catch (error) {
    loadingManager.resourceError(resourceId)
    throw error
  }
}
