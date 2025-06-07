import type React from "react"
import type { Metadata } from "next"
import { CommunityClientLayout } from "./CommunityClientLayout"

export const metadata: Metadata = {
  title: "Community | Big Based",
  description: "Join the Big Based community to discuss features, get help, and connect with other users.",
}

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CommunityClientLayout>{children}</CommunityClientLayout>
}
