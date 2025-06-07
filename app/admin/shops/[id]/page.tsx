import { getShop } from "@/app/actions/shop-actions"
import { notFound } from "next/navigation"
import ShopDashboardClient from "./shop-dashboard-client"

export const metadata = {
  title: "Shop Dashboard | Big Based",
  description: "Manage your e-commerce shop on the Big Based platform.",
}

export default async function ShopDashboardPage({ params }: { params: { id: string } }) {
  const { success, data: shop, error } = await getShop(params.id)

  if (!success || !shop) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ShopDashboardClient shop={shop} />
    </div>
  )
}
