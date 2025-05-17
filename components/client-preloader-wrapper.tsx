"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Preloader from "./preloader"

interface ClientPreloaderWrapperProps {
  children: React.ReactNode
  quotesToShow?: number
}

export default function ClientPreloaderWrapper({ children, quotesToShow }: ClientPreloaderWrapperProps) {
  const [preloaderComplete, setPreloaderComplete] = useState(false)
  const [initialPreloaderRemoved, setInitialPreloaderRemoved] = useState(false)

  // Check if initial preloader has been removed
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if initial preloader exists
    const initialPreloader = window.initialPreloader

    if (initialPreloader) {
      console.log("Initial preloader exists, waiting for it to be removed")

      // Set up observer to detect when initial preloader is removed
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
            for (let i = 0; i < mutation.removedNodes.length; i++) {
              const node = mutation.removedNodes[i]
              if (node === initialPreloader) {
                console.log("Initial preloader removed")
                setInitialPreloaderRemoved(true)
                observer.disconnect()
                break
              }
            }
          }
        })
      })

      observer.observe(document.body, { childList: true })

      // Safety timeout - if initial preloader isn't removed after 10 seconds, assume it's gone
      const timeout = setTimeout(() => {
        console.log("Initial preloader timeout")
        setInitialPreloaderRemoved(true)
      }, 10000)

      return () => {
        observer.disconnect()
        clearTimeout(timeout)
      }
    } else {
      // No initial preloader, proceed normally
      console.log("No initial preloader found")
      setInitialPreloaderRemoved(true)
    }
  }, [])

  // Handle preloader completion
  const handlePreloaderComplete = () => {
    setPreloaderComplete(true)
  }

  // If initial preloader is still active, don't show React preloader
  if (!initialPreloaderRemoved) {
    return <>{children}</>
  }

  return (
    <>
      {!preloaderComplete && <Preloader quotesToShow={quotesToShow} onComplete={handlePreloaderComplete} />}
      <div style={{ visibility: preloaderComplete ? "visible" : "hidden" }}>{children}</div>
    </>
  )
}
