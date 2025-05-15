import type { Metadata, Viewport } from "next/types"
import { baseMetadata, viewportConfig } from "../metadata-config"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Profile | Big Based",
}

export const viewport: Viewport = viewportConfig

import ProfileClientPage from "./ProfileClientPage"

export default function ProfilePage() {
  return <ProfileClientPage />
}
