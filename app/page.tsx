import type { Metadata, Viewport } from "next/types"
import { baseMetadata, viewportConfig } from "./metadata-config"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Home | Big Based",
}

export const viewport: Viewport = viewportConfig

export default function Home() {
  return <ClientPage />
}
