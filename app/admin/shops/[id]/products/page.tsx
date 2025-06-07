import { getShop } from "@/app/actions/shop-actions"
import { notFound } from "next/navigation"
import ProductsClientPage from "./products-client-page"

export const metadata = {
  title: "Shop Products | Big Based",
  description: "Manage your shop's product catalog.",
}

export default async function ShopProductsPage({ params }: { params: { id: string } }) {
  const { success, data: shop, error } = await getShop(params.id)

  if (!success || !shop) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductsClientPage shop={shop} />
    </div>
  )
}
