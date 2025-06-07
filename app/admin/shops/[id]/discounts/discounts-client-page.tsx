"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, CalendarIcon, Percent, DollarSign, Users, Package, Tag } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface Discount {
  id: string
  code: string
  type: "percentage" | "fixed_amount" | "free_shipping"
  value: number
  description?: string
  minimum_order_amount?: number
  usage_limit?: number
  usage_count: number
  starts_at?: Date
  ends_at?: Date
  is_active: boolean
  applies_to: "all" | "specific_products" | "specific_collections"
  product_ids?: string[]
  collection_ids?: string[]
  customer_eligibility: "all" | "specific_customers" | "customer_groups"
  customer_ids?: string[]
  customer_group_ids?: string[]
  created_at: Date
  updated_at: Date
}

interface DiscountsClientPageProps {
  shopId: string
  initialDiscounts: Discount[]
}

export default function DiscountsClientPage({ shopId, initialDiscounts }: DiscountsClientPageProps) {
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as const,
    value: 0,
    description: "",
    minimum_order_amount: 0,
    usage_limit: 0,
    starts_at: undefined as Date | undefined,
    ends_at: undefined as Date | undefined,
    is_active: true,
    applies_to: "all" as const,
    customer_eligibility: "all" as const,
  })

  const resetForm = () => {
    setFormData({
      code: "",
      type: "percentage",
      value: 0,
      description: "",
      minimum_order_amount: 0,
      usage_limit: 0,
      starts_at: undefined,
      ends_at: undefined,
      is_active: true,
      applies_to: "all",
      customer_eligibility: "all",
    })
  }

  const handleCreateDiscount = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newDiscount: Discount = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        usage_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      }

      setDiscounts((prev) => [newDiscount, ...prev])
      setIsCreateDialogOpen(false)
      resetForm()
      toast({
        title: "Discount created",
        description: "Your discount code has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create discount. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditDiscount = async () => {
    if (!selectedDiscount) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedDiscount = {
        ...selectedDiscount,
        ...formData,
        updated_at: new Date(),
      }

      setDiscounts((prev) => prev.map((d) => (d.id === selectedDiscount.id ? updatedDiscount : d)))
      setIsEditDialogOpen(false)
      setSelectedDiscount(null)
      resetForm()
      toast({
        title: "Discount updated",
        description: "Your discount code has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update discount. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDiscount = async (discountId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDiscounts((prev) => prev.filter((d) => d.id !== discountId))
      toast({
        title: "Discount deleted",
        description: "The discount code has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete discount. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (discount: Discount) => {
    setSelectedDiscount(discount)
    setFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      description: discount.description || "",
      minimum_order_amount: discount.minimum_order_amount || 0,
      usage_limit: discount.usage_limit || 0,
      starts_at: discount.starts_at,
      ends_at: discount.ends_at,
      is_active: discount.is_active,
      applies_to: discount.applies_to,
      customer_eligibility: discount.customer_eligibility,
    })
    setIsEditDialogOpen(true)
  }

  const getDiscountIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-4 w-4" />
      case "fixed_amount":
        return <DollarSign className="h-4 w-4" />
      case "free_shipping":
        return <Package className="h-4 w-4" />
      default:
        return <Tag className="h-4 w-4" />
    }
  }

  const formatDiscountValue = (discount: Discount) => {
    switch (discount.type) {
      case "percentage":
        return `${discount.value}% off`
      case "fixed_amount":
        return `$${discount.value} off`
      case "free_shipping":
        return "Free shipping"
      default:
        return discount.value.toString()
    }
  }

  const getDiscountStatus = (discount: Discount) => {
    if (!discount.is_active) return "inactive"
    if (discount.starts_at && new Date() < discount.starts_at) return "scheduled"
    if (discount.ends_at && new Date() > discount.ends_at) return "expired"
    if (discount.usage_limit && discount.usage_count >= discount.usage_limit) return "used_up"
    return "active"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "scheduled":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Scheduled
          </Badge>
        )
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      case "used_up":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-700">
            Used Up
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Discounts</h1>
          <p className="text-muted-foreground">Create and manage discount codes for your shop</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Discount
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Discount</DialogTitle>
              <DialogDescription>Set up a new discount code for your customers</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="usage">Usage Limits</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Discount Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="SAVE20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Discount Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                        <SelectItem value="free_shipping">Free Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.type !== "free_shipping" && (
                  <div className="space-y-2">
                    <Label htmlFor="value">{formData.type === "percentage" ? "Percentage (%)" : "Amount ($)"}</Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, value: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder={formData.type === "percentage" ? "20" : "10.00"}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Internal description for this discount"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </TabsContent>

              <TabsContent value="conditions" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minimum_order">Minimum Order Amount ($)</Label>
                  <Input
                    id="minimum_order"
                    type="number"
                    value={formData.minimum_order_amount}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, minimum_order_amount: Number.parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Applies To</Label>
                  <Select
                    value={formData.applies_to}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, applies_to: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="specific_products">Specific Products</SelectItem>
                      <SelectItem value="specific_collections">Specific Collections</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Customer Eligibility</Label>
                  <Select
                    value={formData.customer_eligibility}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, customer_eligibility: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="specific_customers">Specific Customers</SelectItem>
                      <SelectItem value="customer_groups">Customer Groups</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="usage" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="usage_limit">Usage Limit (0 = unlimited)</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, usage_limit: Number.parseInt(e.target.value) || 0 }))
                    }
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.starts_at && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.starts_at ? format(formData.starts_at, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.starts_at}
                          onSelect={(date) => setFormData((prev) => ({ ...prev, starts_at: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.ends_at && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.ends_at ? format(formData.ends_at, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.ends_at}
                          onSelect={(date) => setFormData((prev) => ({ ...prev, ends_at: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDiscount} disabled={isLoading || !formData.code}>
                {isLoading ? "Creating..." : "Create Discount"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discounts</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discounts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {discounts.filter((d) => getDiscountStatus(d) === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discounts.reduce((sum, d) => sum + d.usage_count, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {discounts.filter((d) => getDiscountStatus(d) === "scheduled").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Discount Codes</CardTitle>
          <CardDescription>Manage all your discount codes and promotions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {getDiscountIcon(discount.type)}
                      <span>{discount.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{discount.type.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>{formatDiscountValue(discount)}</TableCell>
                  <TableCell>{getStatusBadge(getDiscountStatus(discount))}</TableCell>
                  <TableCell>
                    {discount.usage_count}
                    {discount.usage_limit ? ` / ${discount.usage_limit}` : ""}
                  </TableCell>
                  <TableCell>{format(discount.created_at, "MMM dd, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(discount)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDiscount(discount.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Discount</DialogTitle>
            <DialogDescription>Update the discount code settings</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="usage">Usage Limits</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Discount Code</Label>
                  <Input
                    id="edit-code"
                    value={formData.code}
                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="SAVE20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Discount Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.type !== "free_shipping" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-value">{formData.type === "percentage" ? "Percentage (%)" : "Amount ($)"}</Label>
                  <Input
                    id="edit-value"
                    type="number"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, value: Number.parseFloat(e.target.value) || 0 }))
                    }
                    placeholder={formData.type === "percentage" ? "20" : "10.00"}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Internal description for this discount"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="edit-is_active">Active</Label>
              </div>
            </TabsContent>

            <TabsContent value="conditions" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-minimum_order">Minimum Order Amount ($)</Label>
                <Input
                  id="edit-minimum_order"
                  type="number"
                  value={formData.minimum_order_amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, minimum_order_amount: Number.parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Applies To</Label>
                <Select
                  value={formData.applies_to}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, applies_to: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="specific_products">Specific Products</SelectItem>
                    <SelectItem value="specific_collections">Specific Collections</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Customer Eligibility</Label>
                <Select
                  value={formData.customer_eligibility}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, customer_eligibility: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="specific_customers">Specific Customers</SelectItem>
                    <SelectItem value="customer_groups">Customer Groups</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-usage_limit">Usage Limit (0 = unlimited)</Label>
                <Input
                  id="edit-usage_limit"
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, usage_limit: Number.parseInt(e.target.value) || 0 }))
                  }
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.starts_at && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.starts_at ? format(formData.starts_at, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.starts_at}
                        onSelect={(date) => setFormData((prev) => ({ ...prev, starts_at: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.ends_at && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.ends_at ? format(formData.ends_at, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.ends_at}
                        onSelect={(date) => setFormData((prev) => ({ ...prev, ends_at: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDiscount} disabled={isLoading || !formData.code}>
              {isLoading ? "Updating..." : "Update Discount"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
