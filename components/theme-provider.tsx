"use client"
import { createContext, useEffect } from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import type { ThemeProviderProps as NextThemeProviderProps } from "next-themes"

type Theme = "dark" | "light"

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, ...props }: NextThemeProviderProps) {
  // Apply theme class to body when theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains("dark")

      if (isDark) {
        document.body.classList.add("dark-mode")
        document.body.classList.remove("light-mode")
        document.body.style.backgroundColor = "#111827"
      } else {
        document.body.classList.add("light-mode")
        document.body.classList.remove("dark-mode")
        document.body.style.backgroundColor = "#ffffff"
      }
    }

    // Set up mutation observer to watch for class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          handleThemeChange()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    // Initial call
    handleThemeChange()

    return () => {
      observer.disconnect()
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Custom hook that wraps next-themes useTheme to maintain compatibility with existing code
export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return {
    theme: (resolvedTheme || theme) as Theme,
    setTheme: setTheme as (theme: Theme) => void,
    toggleTheme,
  }
}
