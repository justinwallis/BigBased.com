import type { Metadata } from "next"
import ImageDebugPageClient from "./ImageDebugPageClient"

export const metadata: Metadata = {
  title: "Image Debug | Big Based",
  description: "Debug image loading and optimization",
}

export default function ImageDebugPage() {
  return <ImageDebugPageClient />
}
