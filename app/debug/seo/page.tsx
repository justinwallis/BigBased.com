import { Suspense } from "react"
import SeoDebugger from "@/components/debug/seo-debugger"
import RemovePreloader from "../remove-preloader"

export default function SeoDebugPage() {
  return (
    <>
      <RemovePreloader />
      <Suspense fallback={<div>Loading SEO debugger...</div>}>
        <SeoDebugger />
      </Suspense>
    </>
  )
}
