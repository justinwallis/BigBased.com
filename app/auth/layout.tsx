import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">{children}</div>
    </ThemeProvider>
  )
}
