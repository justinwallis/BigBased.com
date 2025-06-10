import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css" // Use global CSS for theme variables
import "./ai-styles.css" // Specific AI styles

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BigBased AI Chat",
  description: "Chat with BigBased AI - Your conservative values and digital sovereignty assistant.",
}

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className={inter.className}>{children}</div>
}
