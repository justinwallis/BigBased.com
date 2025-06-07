import { getShop } from "@/app/actions/shop-actions"
import { notFound } from "next/navigation"
import DiscountsClientPage from "./discounts-client-page"

export const metadata = {
  title: "Shop Discounts | Big Based",
  description: "Manage your shop's discount codes and promotions.",
}

export default async function ShopDiscountsPage({ params }: { params: { id: string } }) {
  const { success, data: shop, error } = await getShop(params.id)

  if (!success || !shop) {
    return notFound()
  }

  return <DiscountsClientPage shop={shop} />
}
