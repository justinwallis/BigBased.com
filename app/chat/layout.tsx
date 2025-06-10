import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./ai-styles.css" // Ensure this path is correct

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BigBased AI Chat", // Updated title
  description: "Chat with BigBased AI - Your conservative values and digital sovereignty assistant.",
}

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className={inter.className}>{children}</div>
}
