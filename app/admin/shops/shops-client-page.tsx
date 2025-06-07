"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createShop, getShopPlans } from "@/app/actions/shop-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Store, Settings, Users, ShoppingBag, BarChart3, CreditCard } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"

interface ShopsClientPageProps {
  initialShops: any[]
  error?: string
}

export default function ShopsClientPage({ initialShops, error }: ShopsClientPageProps) {
  const [shops, setShops] = useState(initialShops)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [plans, setPlans] = useState<any[]>([])
  const [selectedPlan, setSelectedPlan] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }

    // Load shop plans
    const loadPlans = async () => {
      const { success, data } = await getShopPlans()
      if (success && data) {
        setPlans(data)
        if (data.length > 0) {
          setSelectedPlan(data[0].id)
        }
      }
    }

    loadPlans()
  }, [error])

  const handleCreateShop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await createShop(formData)

      if (result.success) {
        toast({
          title: "Shop created",
          description: "Your new shop has been created successfully.",
        })
        setShops([result.data, ...shops])
        setIsDialogOpen(false)
        router.push(`/admin/shops/${result.data.id}`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create shop",
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
      setIsCreating(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Shops</h1>
          <p className="text-muted-foreground mt-1">Create and manage your e-commerce shops</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Shop
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateShop}>
              <DialogHeader>
                <DialogTitle>Create a new shop</DialogTitle>
                <DialogDescription>Set up your e-commerce shop to start selling products online.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Shop Name</Label>
                  <Input id="name" name="name" placeholder="My Awesome Shop" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what your shop sells..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="plan_id">Shop Plan</Label>
                  <Select name="plan_id" value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - ${plan.price}/{plan.billing_interval}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Shop
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {shops.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Store className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No shops yet</h2>
          <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
            Create your first shop to start selling products online and grow your business.
          </p>
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Shop
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <Card key={shop.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{shop.name}</CardTitle>
                    <CardDescription className="mt-1">{shop.slug}</CardDescription>
                  </div>
                  <Badge variant={shop.status === "active" ? "default" : "outline"}>
                    {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {shop.description || "No description provided"}
                </p>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 mr-1" />
                  <span>{shop.shop_plans?.name || "Basic"} Plan</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 pt-2">
                <div className="grid grid-cols-3 w-full gap-2">
                  <Link href={`/admin/shops/${shop.id}/products`}>
                    <Button variant="outline" className="w-full" size="sm">
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Products
                    </Button>
                  </Link>
                  <Link href={`/admin/shops/${shop.id}/orders`}>
                    <Button variant="outline" className="w-full" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Orders
                    </Button>
                  </Link>
                  <Link href={`/admin/shops/${shop.id}/customers`}>
                    <Button variant="outline" className="w-full" size="sm">
                      <Users className="h-4 w-4 mr-1" />
                      Customers
                    </Button>
                  </Link>
                </div>
                <Link href={`/admin/shops/${shop.id}`} className="w-full">
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Shop
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
