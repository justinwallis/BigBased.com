"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useNavigation } from "@/contexts/navigation-context"

interface SectionObserverProps {
  sectionId: string
  children: React.ReactNode
}

export default function SectionObserver({ sectionId, children }: SectionObserverProps) {
  const { setActiveSection } = useNavigation()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId)
          }
        })
      },
      {
        rootMargin: "-50% 0px -50% 0px", // Consider section in view when it's in the middle 50% of viewport
        threshold: 0.1,
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [sectionId, setActiveSection])

  return (
    <div id={sectionId} ref={sectionRef}>
      {children}
    </div>
  )
}
