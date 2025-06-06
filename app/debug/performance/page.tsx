import type { Metadata } from "next"
import PerformanceDebugClientPage from "./PerformanceDebugClientPage"

export const metadata: Metadata = {
  title: "Performance Debug | Big Based",
  description: "Debug performance metrics and optimizations",
}

export default function PerformanceDebugPage() {
  return <PerformanceDebugClientPage />
}
