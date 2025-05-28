import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../../../metadata-config"
import SessionsClientPage from "./SessionsClientPage"

export const metadata: Metadata = generateMetadata("Active Sessions", "View and manage your active login sessions.")

export const viewport: Viewport = viewportConfig

export default function SessionsPage() {
  return <SessionsClientPage />
}
