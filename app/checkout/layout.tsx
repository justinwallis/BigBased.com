import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="bb-2025-page min-h-screen">
        <main>{children}</main>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
