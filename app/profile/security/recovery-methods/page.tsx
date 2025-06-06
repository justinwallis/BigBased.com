import { RecoveryMethodsClientPage } from "./RecoveryMethodsClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recovery Methods | Big Based",
  description: "Manage your account recovery methods",
}

export default function RecoveryMethodsPage() {
  return <RecoveryMethodsClientPage />
}
