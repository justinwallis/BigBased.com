import type { Metadata } from "next"
import FaviconDebugger from "@/components/debug/favicon-debugger"

export const metadata: Metadata = {
  title: "Favicon Debugger | Big Based",
  description: "Debug and test all favicon and app icons for Big Based",
}

export default function FaviconDebugPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Favicon Debugger</h1>
      <p className="text-gray-600 mb-8">
        This page displays all favicon and app icons used by Big Based, allowing you to verify their existence and
        appearance.
      </p>

      <FaviconDebugger />
    </div>
  )
}
