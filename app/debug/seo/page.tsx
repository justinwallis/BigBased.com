import type { Metadata } from "next"
import SeoDebugger from "@/components/debug/seo-debugger"

export const metadata: Metadata = {
  title: "SEO Debugger | Big Based",
  description: "Debug and analyze SEO metrics for Big Based",
}

export default function SeoDebugPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">SEO Debugger</h1>
      <p className="text-gray-600 mb-8">This page analyzes and displays SEO metrics for the Big Based website.</p>

      <SeoDebugger />
    </div>
  )
}
