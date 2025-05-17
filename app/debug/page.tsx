import { Suspense } from "react"
import MasterDebugger from "@/components/debug/master-debugger"
import RemovePreloader from "./remove-preloader"

export default function DebugPage() {
  return (
    <>
      <RemovePreloader />
      <Suspense fallback={<div>Loading debug tools...</div>}>
        <MasterDebugger />
      </Suspense>
    </>
  )
}
