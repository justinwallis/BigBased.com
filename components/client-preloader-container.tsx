"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Preloader from "./preloader"
import { useTheme } from "next-themes"

interface ClientPreloaderContainerProps {
  children: React.ReactNode
  quotesToShow?: number
}

export default function ClientPreloaderContainer({ children, quotesToShow }: ClientPreloaderContainerProps) {
  const [showPreloader, setShowPreloader] = useState(true)
  const { theme, resolvedTheme } = useTheme()
  const isDark = theme === "dark" || resolvedTheme === "dark"

  // Handle preloader completion
  const handlePreloaderComplete = () => {
    setShowPreloader(false)
  }

  // Apply theme to body
  useEffect(() => {
    if (isDark) {
      document.body.style.backgroundColor = "#111827"
      document.body.classList.add("dark-mode")
      document.body.classList.remove("light-mode")
    } else {
      document.body.style.backgroundColor = "#ffffff"
      document.body.classList.add("light-mode")
      document.body.classList.remove("dark-mode")
    }
  }, [isDark])

  return (
    <>
      {showPreloader ? (
        <Preloader quotesToShow={quotesToShow} onComplete={handlePreloaderComplete} />
      ) : (
        <div style={{ backgroundColor: isDark ? "#111827" : "#ffffff", minHeight: "100vh" }}>{children}</div>
      )}
    </>
  )
}
