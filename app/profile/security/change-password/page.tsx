import { Suspense } from "react"
import ChangePasswordClientPage from "./ChangePasswordClientPage"

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordClientPage />
    </Suspense>
  )
}
