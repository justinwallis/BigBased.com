import { getShop } from "@/app/actions/shop-actions"
import { notFound } from "next/navigation"
import CustomersClientPage from "./customers-client-page"

export const metadata = {
  title: "Shop Customers | Big Based",
  description: "Manage your shop's customers.",
}

export default async function ShopCustomersPage({ params }: { params: { id: string } }) {
  const { success, data: shop, error } = await getShop(params.id)

  if (!success || !shop) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CustomersClientPage shop={shop} />
    </div>
  )
}
