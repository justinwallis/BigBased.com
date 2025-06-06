import { VerifyRecoveryTokenClientPage } from "./VerifyRecoveryTokenClientPage"
import type { Metadata } from "next"

// Add static metadata to prevent the title error
export const metadata: Metadata = {
  title: "Verify Recovery Token | Big Based",
  description: "Verify your account recovery token",
}

export default function VerifyRecoveryTokenPage() {
  return <VerifyRecoveryTokenClientPage />
}
