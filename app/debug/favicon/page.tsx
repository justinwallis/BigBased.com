import { Suspense } from "react"
import FaviconDebugger from "@/components/debug/favicon-debugger"
import RemovePreloader from "../remove-preloader"

export default function FaviconDebugPage() {
  return (
    <>
      <RemovePreloader />
      <Suspense fallback={<div>Loading favicon debugger...</div>}>
        <FaviconDebugger />
      </Suspense>
    </>
  )
}
