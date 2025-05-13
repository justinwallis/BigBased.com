type ResourceStatus = "pending" | "loading" | "loaded" | "error"

interface Resource {
  id: string
  status: ResourceStatus
  weight: number // Importance weight for progress calculation
}

class LoadingManager {
  private static instance: LoadingManager
  private resources: Map<string, Resource> = new Map()
  private progressListeners: ((progress: number) => void)[] = []
  private completeListeners: (() => void)[] = []
  private totalWeight = 0
  private loadedWeight = 0
  private isComplete = false

  private constructor() {}

  public static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager()
    }
    return LoadingManager.instance
  }

  /**
   * Register a resource that needs to be loaded
   */
  public registerResource(id: string, weight = 1): void {
    if (this.resources.has(id)) return

    this.resources.set(id, {
      id,
      status: "pending",
      weight,
    })
    this.totalWeight += weight
    this.notifyProgressListeners()
  }

  /**
   * Mark a resource as loading
   */
  public startLoading(id: string): void {
    const resource = this.resources.get(id)
    if (resource && resource.status === "pending") {
      resource.status = "loading"
      this.notifyProgressListeners()
    }
  }

  /**
   * Mark a resource as loaded
   */
  public resourceLoaded(id: string): void {
    const resource = this.resources.get(id)
    if (resource && resource.status !== "loaded") {
      if (resource.status !== "error") {
        this.loadedWeight += resource.weight
      }
      resource.status = "loaded"
      this.checkComplete()
      this.notifyProgressListeners()
    }
  }

  /**
   * Mark a resource as failed to load
   */
  public resourceError(id: string): void {
    const resource = this.resources.get(id)
    if (resource && resource.status !== "error") {
      resource.status = "error"
      this.checkComplete()
      this.notifyProgressListeners()
    }
  }

  /**
   * Get the current loading progress (0-100)
   */
  public getProgress(): number {
    if (this.totalWeight === 0) return 100
    return Math.min(Math.round((this.loadedWeight / this.totalWeight) * 100), 100)
  }

  /**
   * Add a listener for progress updates
   */
  public onProgress(callback: (progress: number) => void): () => void {
    this.progressListeners.push(callback)
    // Immediately call with current progress
    callback(this.getProgress())

    // Return unsubscribe function
    return () => {
      this.progressListeners = this.progressListeners.filter((cb) => cb !== callback)
    }
  }

  /**
   * Add a listener for when all resources are loaded
   */
  public onComplete(callback: () => void): () => void {
    if (this.isComplete) {
      // If already complete, call immediately
      setTimeout(callback, 0)
      return () => {}
    }

    this.completeListeners.push(callback)

    // Return unsubscribe function
    return () => {
      this.completeListeners = this.completeListeners.filter((cb) => cb !== callback)
    }
  }

  /**
   * Check if all resources are loaded and notify listeners if so
   */
  private checkComplete(): void {
    if (this.isComplete) return

    const allLoaded = Array.from(this.resources.values()).every(
      (resource) => resource.status === "loaded" || resource.status === "error",
    )

    if (allLoaded && this.resources.size > 0) {
      this.isComplete = true
      this.notifyCompleteListeners()
    }
  }

  /**
   * Notify all progress listeners
   */
  private notifyProgressListeners(): void {
    const progress = this.getProgress()
    this.progressListeners.forEach((callback) => callback(progress))
  }

  /**
   * Notify all complete listeners
   */
  private notifyCompleteListeners(): void {
    this.completeListeners.forEach((callback) => callback())
  }

  /**
   * Reset the loading manager (for testing or page reloads)
   */
  public reset(): void {
    this.resources.clear()
    this.totalWeight = 0
    this.loadedWeight = 0
    this.isComplete = false
  }

  /**
   * Get debug information about resources
   */
  public getResourcesStatus(): Record<string, ResourceStatus> {
    const status: Record<string, ResourceStatus> = {}
    this.resources.forEach((resource) => {
      status[resource.id] = resource.status
    })
    return status
  }
}

export default LoadingManager.getInstance()
