import type { Metadata } from "next"
import ManifestDebugger from "@/components/debug/manifest-debugger"

export const metadata: Metadata = {
  title: "Manifest Debugger | Big Based",
  description: "Debug and test the web app manifest for Big Based",
}

export default function ManifestDebugPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Web App Manifest Debugger</h1>
      <p className="text-gray-600 mb-8">This page tests and validates the web app manifest files for Big Based.</p>

      <ManifestDebugger />
    </div>
  )
}
