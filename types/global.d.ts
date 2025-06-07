interface Window {
  initialPreloader?: HTMLDivElement
  Sentry?: {
    captureException: (error: Error) => void
    captureMessage: (message: string) => void
  }
}
