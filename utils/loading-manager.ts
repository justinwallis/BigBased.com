// Placeholder implementation of loading manager
const loadingManager = {
  registerResource: (id: string, weight = 1) => {
    console.log(`Resource ${id} registered with weight ${weight}`)
  },
  startLoading: (id: string) => {
    console.log(`Resource ${id} started loading`)
  },
  resourceLoaded: (id: string) => {
    console.log(`Resource ${id} loaded`)
  },
  resourceError: (id: string) => {
    console.log(`Resource ${id} error`)
  },
  getProgress: () => 100,
  onProgress: (callback: (progress: number) => void) => {
    callback(100)
    return () => {}
  },
  onComplete: (callback: () => void) => {
    setTimeout(callback, 0)
    return () => {}
  },
}

export default loadingManager
