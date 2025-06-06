import { AccountRecoveryClientPage } from "./AccountRecoveryClientPage"
import type { Metadata } from "next"

// Add static metadata to prevent the title error
export const metadata: Metadata = {
  title: "Account Recovery | Big Based",
  description: "Recover your Big Based account",
}

export default function AccountRecoveryPage() {
  return <AccountRecoveryClientPage />
}
