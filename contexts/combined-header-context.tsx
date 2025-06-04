"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CombinedHeaderContextType {
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
}

const CombinedHeaderContext = createContext<CombinedHeaderContextType | undefined>(undefined)

export function CombinedHeaderProvider({
  children,
  initialEnabled = false,
}: { children: ReactNode; initialEnabled?: boolean }) {
  const [isEnabled, setIsEnabled] = useState(initialEnabled)

  return <CombinedHeaderContext.Provider value={{ isEnabled, setIsEnabled }}>{children}</CombinedHeaderContext.Provider>
}

export function useCombinedHeaderEnabled() {
  const context = useContext(CombinedHeaderContext)

  if (context === undefined) {
    throw new Error("useCombinedHeaderEnabled must be used within a CombinedHeaderProvider")
  }

  return context
}
