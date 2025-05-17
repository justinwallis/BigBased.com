import { Suspense } from "react"
import ManifestDebugger from "@/components/debug/manifest-debugger"
import RemovePreloader from "../remove-preloader"

export default function ManifestDebugPage() {
  return (
    <>
      <RemovePreloader />
      <Suspense fallback={<div>Loading manifest debugger...</div>}>
        <ManifestDebugger />
      </Suspense>
    </>
  )
}
