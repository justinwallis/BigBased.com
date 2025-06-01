"use client"

import type { ReactNode } from "react"

interface SectionPersistenceWrapperProps {
  children: ReactNode
}

export default function SectionPersistenceWrapper({ children }: SectionPersistenceWrapperProps) {
  return <>{children}</>
}
