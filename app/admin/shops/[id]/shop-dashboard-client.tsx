"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateShop } from "@/app/actions/shop-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2, ShoppingBag, Users, Settings, Package, Tag, Globe } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ShopDashboardClientProps {
  shop: any
}

export default function ShopDashboardClient({ shop }: ShopDashboardClientProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleUpdateShop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateShop(shop.id, formData)

      if (result.success) {
        toast({
          title: "Shop updated",
          description: "Your shop details have been updated successfully.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update shop",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{shop.name}</h1>
            <Badge variant={shop.status === "active" ? "default" : "outline"}>
              {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {shop.shop_plans?.name || "Basic"} Plan · Created on {new Date(shop.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/shop/${shop.slug}`} target="_blank">
            <Button variant="outline">
              <Globe className="mr-2 h-4 w-4" />
              View Shop
            </Button>
          </Link>
          <Link href={`/admin/shops/${shop.id}/settings`}>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground mt-1">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">+0% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Shop Details</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href={`/admin/shops/${shop.id}/products`} className="block">
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Products
                  </CardTitle>
                  <CardDescription>Manage your product catalog</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Products
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href={`/admin/shops/${shop.id}/orders`} className="block">
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Orders
                  </CardTitle>
                  <CardDescription>Process customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Orders
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href={`/admin/shops/${shop.id}/customers`} className="block">
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Customers
                  </CardTitle>
                  <CardDescription>Manage your customer base</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Customers
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href={`/admin/shops/${shop.id}/discounts`} className="block">
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Discounts
                  </CardTitle>
                  <CardDescription>Create promotional offers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Discounts
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from your customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="mx-auto h-8 w-8 opacity-50" />
                  <p className="mt-2">No orders yet</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Your best-selling products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="mx-auto h-8 w-8 opacity-50" />
                  <p className="mt-2">No products yet</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Shop Details</CardTitle>
              <CardDescription>Update your shop information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateShop} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Shop Name</Label>
                    <Input id="name" name="name" defaultValue={shop.name} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom_domain">Custom Domain (Optional)</Label>
                    <Input
                      id="custom_domain"
                      name="custom_domain"
                      defaultValue={shop.custom_domain || ""}
                      placeholder="myshop.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={shop.description || ""}
                    placeholder="Describe what your shop sells..."
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="business_email">Business Email</Label>
                    <Input
                      id="business_email"
                      name="business_email"
                      type="email"
                      defaultValue={shop.business_email || ""}
                      placeholder="business@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support_email">Support Email</Label>
                    <Input
                      id="support_email"
                      name="support_email"
                      type="email"
                      defaultValue={shop.support_email || ""}
                      placeholder="support@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_phone">Business Phone</Label>
                    <Input
                      id="business_phone"
                      name="business_phone"
                      defaultValue={shop.business_phone || ""}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Shop Appearance</CardTitle>
              <CardDescription>Customize how your shop looks</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateShop} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input
                      id="logo_url"
                      name="logo_url"
                      defaultValue={shop.logo_url || ""}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner_url">Banner URL</Label>
                    <Input
                      id="banner_url"
                      name="banner_url"
                      defaultValue={shop.banner_url || ""}
                      placeholder="https://example.com/banner.png"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary_color"
                        name="primary_color"
                        defaultValue={shop.primary_color || "#000000"}
                        placeholder="#000000"
                      />
                      <Input
                        type="color"
                        className="w-12 p-1 h-10"
                        defaultValue={shop.primary_color || "#000000"}
                        onChange={(e) => {
                          const input = document.getElementById("primary_color") as HTMLInputElement
                          if (input) input.value = e.target.value
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent_color">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent_color"
                        name="accent_color"
                        defaultValue={shop.accent_color || "#ffffff"}
                        placeholder="#ffffff"
                      />
                      <Input
                        type="color"
                        className="w-12 p-1 h-10"
                        defaultValue={shop.accent_color || "#ffffff"}
                        onChange={(e) => {
                          const input = document.getElementById("accent_color") as HTMLInputElement
                          if (input) input.value = e.target.value
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
