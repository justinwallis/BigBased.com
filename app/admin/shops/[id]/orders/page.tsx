import { getShop } from "@/app/actions/shop-actions"
import { notFound } from "next/navigation"
import OrdersClientPage from "./orders-client-page"

export const metadata = {
  title: "Shop Orders | Big Based",
  description: "Manage your shop's orders.",
}

export default async function ShopOrdersPage({ params }: { params: { id: string } }) {
  const { success, data: shop, error } = await getShop(params.id)

  if (!success || !shop) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrdersClientPage shop={shop} />
    </div>
  )
}
