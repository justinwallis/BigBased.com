"use client"

import type React from "react"

import { useState } from "react"
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
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, ShoppingBag, ArrowLeft, Search, Filter } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductsClientPageProps {
  shop: any
}

export default function ProductsClientPage({ shop }: ProductsClientPageProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      // This would be replaced with an actual API call
      setTimeout(() => {
        toast({
          title: "Product created",
          description: "Your new product has been created successfully.",
        })
        setIsDialogOpen(false)
        // Add mock product to state
        const formData = new FormData(e.currentTarget)
        const newProduct = {
          id: Math.random().toString(36).substring(2, 9),
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          price: Number.parseFloat(formData.get("price") as string),
          status: "draft",
          inventory_quantity: Number.parseInt(formData.get("inventory_quantity") as string, 10),
          created_at: new Date().toISOString(),
        }
        setProducts([newProduct, ...products])
        setIsCreating(false)
      }, 1000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
      setIsCreating(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/shops/${shop.id}`}
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold mt-2">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog for {shop.name}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleCreateProduct}>
              <DialogHeader>
                <DialogTitle>Add a new product</DialogTitle>
                <DialogDescription>Create a new product to sell in your shop.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" placeholder="Premium T-Shirt" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="29.99" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="inventory_quantity">Inventory Quantity</Label>
                    <Input
                      id="inventory_quantity"
                      name="inventory_quantity"
                      type="number"
                      min="0"
                      placeholder="100"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Describe your product..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Product
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {products.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">No products yet</h2>
              <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                Add your first product to start selling in your shop.
              </p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant={product.status === "active" ? "default" : "outline"}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {product.description || "No description provided"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">${product.price.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Stock: {product.inventory_quantity}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/admin/shops/${shop.id}/products/${product.id}`}>Edit Product</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No active products</h2>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              Publish your products to make them active and available for purchase.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No draft products</h2>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              Draft products are saved but not visible to customers.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="archived">
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No archived products</h2>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              Archived products are hidden from your shop but can be restored.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
