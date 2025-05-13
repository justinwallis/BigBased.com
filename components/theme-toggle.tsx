"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface ThemeToggleProps {
  variant?: "icon" | "button"
  className?: string
}

export function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`${className} ${
        variant === "button"
          ? "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          : "p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      }`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-5 w-5 text-white" />
          {variant === "button" && <span>Light mode</span>}
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 text-gray-800" />
          {variant === "button" && <span>Dark mode</span>}
        </>
      )}
    </button>
  )
}
