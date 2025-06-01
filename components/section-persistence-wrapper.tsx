"use client"

import type { ReactNode } from "react"

interface SectionPersistenceWrapperProps {
  children: ReactNode
}

export function SectionPersistenceWrapper({ children }: SectionPersistenceWrapperProps) {
  return <>{children}</>
}

// Named export
export { SectionPersistenceWrapper as default }
