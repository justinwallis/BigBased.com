import type { Metadata, Viewport } from "next/types"
import { viewportConfig, generateMetadata } from "../metadata-config"
import ProfileClientPage from "./ProfileClientPage"

export const metadata: Metadata = generateMetadata("Profile", "Manage your Big Based profile and account settings.")

export const viewport: Viewport = viewportConfig

export default function ProfilePage() {
  return <ProfileClientPage />
}
