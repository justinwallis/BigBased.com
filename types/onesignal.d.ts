declare global {
  interface Window {
    OneSignal?: {
      init: (options: {
        appId: string
        allowLocalhostAsSecureOrigin?: boolean
      }) => Promise<void>
      requestPermission: () => Promise<boolean>
      getNotificationPermission: () => Promise<string>
      setSubscription: (subscribe: boolean) => Promise<void>
      getUserId: () => Promise<string | null>
      sendTag: (key: string, value: string) => Promise<void>
      sendTags: (tags: Record<string, string>) => Promise<void>
      deleteTag: (key: string) => Promise<void>
      deleteTags: (keys: string[]) => Promise<void>
      getTags: () => Promise<Record<string, string>>
      on: (event: string, callback: Function) => void
      off: (event: string, callback: Function) => void
    }
  }
}

export {}
