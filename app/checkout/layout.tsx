import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main>{children}</main>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
