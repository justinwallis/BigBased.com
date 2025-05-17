import { Suspense } from "react"
import PerformanceDebugger from "@/components/debug/performance-debugger"
import RemovePreloader from "../remove-preloader"

export default function PerformanceDebugPage() {
  return (
    <>
      <RemovePreloader />
      <Suspense fallback={<div>Loading performance debugger...</div>}>
        <PerformanceDebugger />
      </Suspense>
    </>
  )
}
