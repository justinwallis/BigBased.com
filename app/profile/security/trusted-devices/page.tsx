import type { Metadata } from "next"
import { TrustedDevicesClientPage } from "./TrustedDevicesClientPage"

export const metadata: Metadata = {
  title: "Trusted Devices | Big Based",
  description: "Manage your trusted devices for account security",
}

export default function TrustedDevicesPage() {
  return <TrustedDevicesClientPage />
}
