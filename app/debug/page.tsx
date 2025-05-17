import type { Metadata } from "next"
import MasterDebugger from "@/components/debug/master-debugger"
import { DebugErrorBoundary } from "@/components/debug/debug-error-boundary"

export const metadata: Metadata = {
  title: "Master Debug | Big Based",
  description: "Master debugging page for Big Based website",
}

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Master Debug Page</h1>
      <p className="text-gray-600 mb-8">
        This page provides access to all debugging tools and system information for the Big Based website.
      </p>

      <DebugErrorBoundary>
        <MasterDebugger />
      </DebugErrorBoundary>
    </div>
  )
}
