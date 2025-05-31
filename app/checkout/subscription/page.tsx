import { Suspense } from "react"
import CheckoutClientPage from "./CheckoutClientPage"

export const dynamic = "force-dynamic"

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutClientPage />
    </Suspense>
  )
}
