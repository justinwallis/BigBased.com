import { VerifyRecoveryTokenClientPage } from "./VerifyRecoveryTokenClientPage"
import { generateSafeMetadata } from "@/lib/safe-metadata"

export const metadata = generateSafeMetadata("Verify Recovery Token", "Verify your account recovery token")

export default function VerifyRecoveryTokenPage() {
  return <VerifyRecoveryTokenClientPage />
}
