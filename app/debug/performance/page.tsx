import type { Metadata } from "next"
import PerformanceDebugger from "@/components/debug/performance-debugger"

export const metadata: Metadata = {
  title: "Performance Debugger | Big Based",
  description: "Debug and analyze performance metrics for Big Based",
}

export default function PerformanceDebugPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Performance Debugger</h1>
      <p className="text-gray-600 mb-8">
        This page analyzes and displays performance metrics for the Big Based website.
      </p>

      <PerformanceDebugger />
    </div>
  )
}
