import type { Metadata, Viewport } from "next/types"
import { baseMetadata, viewportConfig } from "../metadata-config"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "About | Big Based",
}

export const viewport: Viewport = viewportConfig

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Big Based</h1>
      <p className="mb-4">This is the about page content. You can add more details about your organization here.</p>
    </main>
  )
}
