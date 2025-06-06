import { AccountRecoveryClientPage } from "./AccountRecoveryClientPage"
import { generateSafeMetadata } from "@/lib/safe-metadata"

export const metadata = generateSafeMetadata("Account Recovery", "Recover your Big Based account")

export default function AccountRecoveryPage() {
  return <AccountRecoveryClientPage />
}
