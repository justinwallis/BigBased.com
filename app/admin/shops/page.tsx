import { getUserShops } from "@/app/actions/shop-actions"
import ShopsClientPage from "./shops-client-page"

export const metadata = {
  title: "Manage Your Shops | Big Based",
  description: "Create and manage your e-commerce shops on the Big Based platform.",
}

export default async function ShopsPage() {
  const { success, data: shops, error } = await getUserShops()

  return (
    <div className="container mx-auto px-4 py-8">
      <ShopsClientPage initialShops={success ? shops : []} error={error} />
    </div>
  )
}
