"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BillingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface BillingAddressFormProps {
  address?: BillingAddress
  onSave: (address: BillingAddress) => Promise<void>
}

export function BillingAddressForm({ address, onSave }: BillingAddressFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<BillingAddress>(
    address || {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US",
    },
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSave(formData)
      toast({
        title: "Billing address updated",
        description: "Your billing address has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update billing address",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-white">
          <MapPin className="h-5 w-5" />
          <span>Billing Address</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="line1" className="dark:text-gray-200">
              Address Line 1
            </Label>
            <Input
              id="line1"
              value={formData.line1}
              onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
              placeholder="123 Main Street"
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <Label htmlFor="line2" className="dark:text-gray-200">
              Address Line 2 (Optional)
            </Label>
            <Input
              id="line2"
              value={formData.line2}
              onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
              placeholder="Apt, Suite, etc."
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="dark:text-gray-200">
                City
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="New York"
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="state" className="dark:text-gray-200">
                State
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="NY"
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postal_code" className="dark:text-gray-200">
                ZIP Code
              </Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                placeholder="10001"
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="country" className="dark:text-gray-200">
                Country
              </Label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Billing Address"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
