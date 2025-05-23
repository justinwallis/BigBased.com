import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../../metadata-config"
import SecurityLogClientPage from "./SecurityLogClientPage"

export const metadata: Metadata = generateMetadata(
  "Security Log",
  "View your account security activity and authentication history.",
)

export const viewport: Viewport = viewportConfig

export default function SecurityLogPage() {
  return <SecurityLogClientPage />
}
